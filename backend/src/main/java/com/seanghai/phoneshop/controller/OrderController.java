package com.seanghai.phoneshop.controller;

import com.seanghai.phoneshop.dto.Dtos.CheckoutRequest;
import com.seanghai.phoneshop.dto.Dtos.OrderResponse;
import com.seanghai.phoneshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse checkout(@Valid @RequestBody CheckoutRequest request, Authentication authentication) {
        String email = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                ? authentication.getName() : null;
        return orderService.checkout(request, email);
    }

    @GetMapping
    public List<OrderResponse> myOrders(Authentication authentication) {
        return orderService.myOrders(authentication.getName());
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable Long id) {
        return orderService.get(id);
    }
}
