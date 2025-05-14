import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container container py-5">
      <div class="success-content text-center">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Thank You for Your Order!</h1>
        <p class="lead">Your order has been successfully placed.</p>
        <p class="order-message">
          We'll send you a confirmation email with your order details shortly.
        </p>
        <div class="mt-4">
          <button class="btn btn-primary me-3" routerLink="/products">
            Continue Shopping
          </button>
          <button class="btn btn-outline-primary" routerLink="/home">
            Return Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      margin-top: 80px;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-content {
      background: white;
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }

    .success-icon {
      font-size: 5rem;
      color: #8A9A5B;
      margin-bottom: 1.5rem;
      animation: scaleIn 0.5s ease;
    }

    h1 {
      color: #36454F;
      margin-bottom: 1rem;
      font-family: 'Playfair Display', serif;
    }

    .lead {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .order-message {
      color: #888;
      font-size: 0.95rem;
    }

    .btn {
      min-width: 150px;
    }

    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class OrderSuccessComponent {} 