package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.exception.ApiException;
import com.seanghai.phoneshop.repository.ProductRepository;
import com.seanghai.phoneshop.repository.ShopOrderRepository;
import com.seanghai.phoneshop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private final ShopOrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public OrderService(
            ShopOrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            AuthService authService
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @Transactional
    public OrderResponse checkout(CheckoutRequest request, String email) {
        ShopOrder order = new ShopOrder();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomerName(request.customerName());
        order.setPhone(request.phone());
        order.setEmail(request.email());
        order.setAddress(request.address());
        order.setNote(request.note());
        order.setStatus(OrderStatus.PENDING);
        if (email != null) {
            order.setCustomer(authService.requireUser(email));
        }

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest line : request.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Product not found"));
            if (product.getStock() < line.quantity()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, product.getName() + " is out of stock");
            }
            product.setStock(product.getStock() - line.quantity());
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .imageUrl(product.getPrimaryImage())
                    .quantity(line.quantity())
                    .unitPrice(product.getPrice())
                    .build();
            items.add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
        }
        order.setItems(items);
        order.setTotal(total);
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders(String email) {
        User user = authService.requireUser(email);
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId()).stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> allOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse get(Long id) {
        return OrderResponse.from(orderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found")));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setStatus(status);
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        List<ShopOrder> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        BigDecimal revenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(ShopOrder::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardResponse(
                productRepository.count(),
                orders.size(),
                userRepository.countByRole(Role.CUSTOMER),
                revenue,
                orders.stream().limit(8).map(OrderResponse::from).toList()
        );
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "SG-" + date + "-" + rand;
    }
}
