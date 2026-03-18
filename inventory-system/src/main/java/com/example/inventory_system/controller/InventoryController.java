package com.example.inventory_system.controller;

import com.example.inventory_system.entity.InventoryTransaction;
import com.example.inventory_system.entity.Product;
import com.example.inventory_system.entity.User;
import com.example.inventory_system.repository.InventoryTransactionRepository;
import com.example.inventory_system.repository.ProductRepository;
import com.example.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryTransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/transactions")
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping("/stock-in")
    public ResponseEntity<?> stockIn(@RequestParam Long productId, @RequestParam int quantity, @RequestParam(required = false) String notes) {
        return processTransaction(productId, quantity, "STOCK_IN", notes);
    }

    @PostMapping("/stock-out")
    public ResponseEntity<?> stockOut(@RequestParam Long productId, @RequestParam int quantity, @RequestParam(required = false) String notes) {
        return processTransaction(productId, quantity, "STOCK_OUT", notes);
    }

    private ResponseEntity<?> processTransaction(Long productId, int quantity, String type, String notes) {
        if (quantity <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be greater than zero");
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        if ("STOCK_OUT".equals(type) && product.getStockQuantity() < quantity) {
            return ResponseEntity.badRequest().body("Insufficient stock for product");
        }

        // Update product stock
        if ("STOCK_IN".equals(type)) {
            product.setStockQuantity(product.getStockQuantity() + quantity);
        } else {
            product.setStockQuantity(product.getStockQuantity() - quantity);
        }
        productRepository.save(product);

        // Record transaction
        String currentUsername = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByUsername(currentUsername).orElseThrow(() -> new RuntimeException("User not found"));

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setUser(currentUser);
        tx.setTransactionType(type);
        tx.setQuantity(quantity);
        tx.setNotes(notes);
        
        transactionRepository.save(tx);

        return ResponseEntity.ok(tx);
    }
}
