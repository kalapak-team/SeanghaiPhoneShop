package com.seanghai.phoneshop.config;

import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.repository.ProductRepository;
import com.seanghai.phoneshop.repository.ShopOrderRepository;
import com.seanghai.phoneshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Demo customers + a year of orders so the admin dashboard cards, chart, and recent sales look populated.
 */
@Configuration
public class DemoSalesSeeder {

    private static final ZoneId ZONE = ZoneId.of("Asia/Phnom_Penh");
    private static final String PASSWORD = "Customer@123";
    private static final int YEAR = 2026;

    private record Person(String name, String email, String phone) {}

    private static final List<Person> PEOPLE = List.of(
            new Person("Olivia Martin", "olivia.martin@email.com", "012 441 120"),
            new Person("Jackson Lee", "jackson.lee@email.com", "015 882 334"),
            new Person("Isabella Nguyen", "isabella.nguyen@email.com", "010 229 441"),
            new Person("William Kim", "will@email.com", "011 673 882"),
            new Person("Sofia Davis", "sofia.davis@email.com", "098 114 256"),
            new Person("Noah Patel", "noah.patel@email.com", "012 778 901"),
            new Person("Emma Chen", "emma.chen@email.com", "016 334 778"),
            new Person("Liam Sok", "liam.sok@email.com", "017 556 221"),
            new Person("Ava Chea", "ava.chea@email.com", "069 441 008"),
            new Person("Ethan Chan", "ethan.chan@email.com", "081 229 670"),
            new Person("Mia Thompson", "mia.thompson@email.com", "092 118 445"),
            new Person("Lucas Park", "lucas.park@email.com", "093 667 120"),
            new Person("Harper Wilson", "harper.wilson@email.com", "096 334 891"),
            new Person("Benjamin Heng", "benjamin.heng@email.com", "097 551 003"),
            new Person("Amelia Sokha", "amelia.sokha@email.com", "088 219 774")
    );

    private static final String[] ADDRESSES = {
            "House 12, Street 155, Toul Tom Poung, Phnom Penh",
            "House 88, Street 271, Phnom Penh",
            "House 36Eo, Street 215, Phsar Depo, Phnom Penh",
            "Apartment 8B, Mao Tse Toung Blvd, Phnom Penh",
            "No. 42, Norodom Boulevard, Chamkarmon, Phnom Penh",
            "Villa 7, Street 271, Tuol Tumpung, Phnom Penh"
    };

    /** Orders per month Jan–Oct. October is lighter because 8 featured recent sales are added after. */
    private static final int[] ORDERS_PER_MONTH = {9, 7, 13, 11, 15, 12, 17, 13, 12, 6};

    /** Target monthly revenue. October bulk is small; featured recent sales bring the month near $5k. */
    private static final int[] MONTH_REVENUE = {2800, 1900, 4300, 3600, 5200, 3900, 5800, 4500, 3700, 800};

    @Bean
    @Order(200)
    CommandLineRunner seedDemoSales(
            UserRepository users,
            ProductRepository products,
            ShopOrderRepository orders,
            PasswordEncoder encoder
    ) {
        return args -> fill(users, products, orders, encoder);
    }

    @Transactional
    void fill(UserRepository users, ProductRepository products, ShopOrderRepository orders, PasswordEncoder encoder) {
        if (orders.count() >= 20) {
            return;
        }

        List<Product> catalog = products.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActive()) && p.getPrice() != null)
                .sorted(Comparator.comparing(Product::getId))
                .toList();
        if (catalog.isEmpty()) {
            return;
        }

        String encoded = encoder.encode(PASSWORD);
        List<User> customers = new ArrayList<>();
        for (Person person : PEOPLE) {
            User user = users.findByEmail(person.email()).orElseGet(() -> users.save(User.builder()
                    .name(person.name())
                    .email(person.email())
                    .phone(person.phone())
                    .password(encoded)
                    .role(Role.CUSTOMER)
                    .build()));
            customers.add(user);
        }

        Random rng = new Random(20261011L);
        AtomicInteger seq = new AtomicInteger(1);
        OrderStatus[] statuses = {
                OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED,
                OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED,
                OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.PENDING, OrderStatus.CANCELLED
        };

        for (int month = 1; month <= 10; month++) {
            int count = ORDERS_PER_MONTH[month - 1];
            int target = MONTH_REVENUE[month - 1];
            int remaining = target;
            int maxDay = month == 10 ? 8 : java.time.YearMonth.of(YEAR, month).lengthOfMonth();

            for (int i = 0; i < count; i++) {
                int leftoverOrders = count - i;
                int orderTarget = leftoverOrders == 1
                        ? Math.max(39, remaining)
                        : Math.max(39, remaining / leftoverOrders + rng.nextInt(120) - 50);
                User customer = customers.get(rng.nextInt(customers.size()));
                int day = 1 + rng.nextInt(maxDay);
                int hour = 9 + rng.nextInt(12);
                int minute = rng.nextInt(60);
                LocalDateTime when = LocalDateTime.of(YEAR, month, day, hour, minute);
                OrderStatus status = month == 10 && i >= count - 3
                        ? OrderStatus.COMPLETED
                        : statuses[rng.nextInt(statuses.length)];
                saveOrder(orders, catalog, customer, orderTarget, status, when, seq, rng);
                remaining -= orderTarget;
            }
        }

        LocalDateTime[] recentTimes = {
                LocalDateTime.of(YEAR, 10, 11, 21, 12),
                LocalDateTime.of(YEAR, 10, 11, 18, 40),
                LocalDateTime.of(YEAR, 10, 11, 14, 5),
                LocalDateTime.of(YEAR, 10, 11, 11, 22),
                LocalDateTime.of(YEAR, 10, 10, 19, 48),
                LocalDateTime.of(YEAR, 10, 10, 16, 10),
                LocalDateTime.of(YEAR, 10, 10, 12, 33),
                LocalDateTime.of(YEAR, 10, 9, 20, 15)
        };
        int[] recentTargets = {1999, 39, 299, 99, 39, 499, 529, 799};
        for (int i = 0; i < recentTimes.length; i++) {
            saveOrder(
                    orders,
                    catalog,
                    customers.get(i),
                    recentTargets[i],
                    OrderStatus.COMPLETED,
                    recentTimes[i],
                    seq,
                    rng
            );
        }
    }

    private void saveOrder(
            ShopOrderRepository orders,
            List<Product> catalog,
            User customer,
            int target,
            OrderStatus status,
            LocalDateTime when,
            AtomicInteger seq,
            Random rng
    ) {
        Product product = pickProducts(catalog, target, rng).get(0);
        BigDecimal unit = BigDecimal.valueOf(Math.max(8, target)).setScale(2, RoundingMode.HALF_UP);

        ShopOrder order = new ShopOrder();
        order.setOrderNumber("SG-" + YEAR + String.format("%02d", when.getMonthValue()) + "-" + String.format("%04d", seq.getAndIncrement()));
        order.setCustomer(customer);
        order.setCustomerName(customer.getName());
        order.setPhone(customer.getPhone() == null ? "012 888 999" : customer.getPhone());
        order.setEmail(customer.getEmail());
        order.setAddress(ADDRESSES[Math.abs(customer.getEmail().hashCode()) % ADDRESSES.length]);
        order.setNote(status == OrderStatus.COMPLETED ? "Paid in store" : null);
        order.setStatus(status);
        order.setCreatedAt(when.atZone(ZONE).toInstant());
        order.setTotal(unit);

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .productName(product.getName())
                .imageUrl(product.getPrimaryImage())
                .quantity(1)
                .unitPrice(unit)
                .build();
        order.setItems(List.of(item));
        orders.save(order);
    }

    private List<Product> pickProducts(List<Product> catalog, int target, Random rng) {
        List<Product> pool = catalog.stream()
                .filter(p -> {
                    double price = p.getPrice().doubleValue();
                    if (target >= 900) return price >= 400;
                    if (target >= 250) return price >= 80 && price <= 900;
                    return price <= 80;
                })
                .toList();
        if (pool.isEmpty()) {
            pool = catalog;
        }
        Product first = pool.get(rng.nextInt(pool.size()));
        List<Product> picked = new ArrayList<>();
        picked.add(first);
        if (target > 600 && rng.nextBoolean()) {
            picked.add(catalog.get(rng.nextInt(catalog.size())));
        }
        return picked;
    }
}
