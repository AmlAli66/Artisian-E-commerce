import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="checkout-container container py-5">
      <div class="row">
        <!-- Checkout Form -->
        <div class="col-lg-8">
          <div class="checkout-form-container">
            <h2 class="mb-4">Checkout</h2>
            
            <!-- Progress Steps -->
            <div class="checkout-steps mb-4">
              <div class="step" [class.active]="currentStep >= 1">
                <div class="step-number">1</div>
                <div class="step-label">Shipping</div>
              </div>
              <div class="step-line"></div>
              <div class="step" [class.active]="currentStep >= 2">
                <div class="step-number">2</div>
                <div class="step-label">Payment</div>
              </div>
              <div class="step-line"></div>
              <div class="step" [class.active]="currentStep === 3">
                <div class="step-number">3</div>
                <div class="step-label">Review</div>
              </div>
            </div>

            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
              <!-- Shipping Information (Step 1) -->
              <div class="form-section" *ngIf="currentStep === 1">
                <h3 class="mb-3">Shipping Information</h3>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="firstName" 
                             formControlName="firstName" placeholder="First Name">
                      <label for="firstName">First Name</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="lastName" 
                             formControlName="lastName" placeholder="Last Name">
                      <label for="lastName">Last Name</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="email" class="form-control" id="email" 
                             formControlName="email" placeholder="Email">
                      <label for="email">Email</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="tel" class="form-control" id="phone" 
                             formControlName="phone" placeholder="Phone">
                      <label for="phone">Phone</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="address" 
                             formControlName="address" placeholder="Address">
                      <label for="address">Address</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="city" 
                             formControlName="city" placeholder="City">
                      <label for="city">City</label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="state" 
                             formControlName="state" placeholder="State">
                      <label for="state">State</label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="zipCode" 
                             formControlName="zipCode" placeholder="ZIP Code">
                      <label for="zipCode">ZIP Code</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Information (Step 2) -->
              <div class="form-section" *ngIf="currentStep === 2">
                <h3 class="mb-3">Payment Information</h3>
                <div class="row g-3">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="cardNumber" 
                             formControlName="cardNumber" placeholder="Card Number">
                      <label for="cardNumber">Card Number</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="cardExpiry" 
                             formControlName="cardExpiry" placeholder="MM/YY">
                      <label for="cardExpiry">Expiry Date (MM/YY)</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="cardCvv" 
                             formControlName="cardCvv" placeholder="CVV">
                      <label for="cardCvv">CVV</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Review (Step 3) -->
              <div class="form-section" *ngIf="currentStep === 3">
                <h3 class="mb-3">Order Review</h3>
                <div class="order-review">
                  <div class="review-section">
                    <h4>Shipping Details</h4>
                    <p>{{ checkoutForm.get('firstName')?.value }} {{ checkoutForm.get('lastName')?.value }}</p>
                    <p>{{ checkoutForm.get('address')?.value }}</p>
                    <p>{{ checkoutForm.get('city')?.value }}, {{ checkoutForm.get('state')?.value }} {{ checkoutForm.get('zipCode')?.value }}</p>
                    <p>{{ checkoutForm.get('email')?.value }}</p>
                    <p>{{ checkoutForm.get('phone')?.value }}</p>
                  </div>
                  <div class="review-section">
                    <h4>Order Summary</h4>
                    <div class="order-items">
                      <div *ngFor="let item of cartItems" class="order-item">
                        <span>{{ item.name }} × {{ item.quantity }}</span>
                        <span>\${{ item.price * item.quantity }}</span>
                      </div>
                    </div>
                    <div class="order-total">
                      <span>Total</span>
                      <span>\${{ cartTotal }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Navigation -->
              <div class="form-navigation mt-4">
                <button type="button" class="btn btn-outline-primary" 
                        *ngIf="currentStep > 1"
                        (click)="previousStep()">
                  Back
                </button>
                <button type="button" class="btn btn-primary" 
                        *ngIf="currentStep < 3"
                        (click)="nextStep()">
                  Continue
                </button>
                <button type="submit" class="btn btn-primary" 
                        *ngIf="currentStep === 3"
                        [disabled]="!checkoutForm.valid || processing">
                  {{ processing ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="col-lg-4">
          <div class="order-summary-sidebar">
            <h3>Order Summary</h3>
            <div class="summary-items">
              <div *ngFor="let item of cartItems" class="summary-item">
                <div class="item-info">
                  <img [src]="item.image" [alt]="item.name">
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>Quantity: {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="item-price">\${{ item.price * item.quantity }}</div>
              </div>
            </div>
            <div class="summary-totals">
              <div class="summary-line">
                <span>Subtotal</span>
                <span>\${{ cartTotal }}</span>
              </div>
              <div class="summary-line">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>\${{ cartTotal }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      margin-top: 80px;
    }

    .checkout-form-container {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .checkout-steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2rem 0;

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        flex: 1;

        &.active {
          .step-number {
            background-color: #8A9A5B;
            color: white;
          }
        }
      }

      .step-number {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
      }

      .step-label {
        font-size: 0.9rem;
        color: #666;
      }

      .step-line {
        flex: 1;
        height: 2px;
        background-color: #f0f0f0;
        margin: 0 1rem;
      }
    }

    .form-section {
      animation: fadeIn 0.3s ease;
    }

    .form-floating {
      margin-bottom: 1rem;

      .form-control {
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 1rem;
        height: calc(3.5rem + 2px);
        line-height: 1.25;

        &:focus {
          border-color: #8A9A5B;
          box-shadow: 0 0 0 0.2rem rgba(138, 154, 91, 0.25);
        }
      }
    }

    .form-navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;

      .btn {
        min-width: 120px;
      }
    }

    .order-summary-sidebar {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 100px;

      h3 {
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #8A9A5B;
      }
    }

    .summary-items {
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .item-info {
        display: flex;
        gap: 1rem;
        align-items: center;

        img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-details {
          h4 {
            font-size: 1rem;
            margin: 0;
          }

          p {
            font-size: 0.9rem;
            color: #666;
            margin: 0;
          }
        }
      }
    }

    .summary-totals {
      .summary-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
        color: #666;

        &.total {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
    }

    .order-review {
      .review-section {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;

        h4 {
          margin-bottom: 1rem;
          color: #333;
        }

        p {
          margin: 0.5rem 0;
          color: #666;
        }
      }

      .order-items {
        .order-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          &:last-child {
            border-bottom: none;
          }
        }
      }

      .order-total {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 991px) {
      .order-summary-sidebar {
        margin-top: 2rem;
        position: static;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  currentStep: number = 1;
  processing: boolean = false;
  cartItems: any[] = [];
  cartTotal: number = 0;
  private cartSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      cardExpiry: ['', [Validators.required]],
      cardCvv: ['', [Validators.required]]
    });

    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  ngOnInit(): void {
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid) {
      this.processing = true;
      try {
        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create order object
        const order = {
          ...this.checkoutForm.value,
          items: this.cartItems,
          total: this.cartTotal,
          orderDate: new Date().toISOString(),
          status: 'processing'
        };

        // Here you would typically send the order to your backend
        console.log('Order placed:', order);

        // Clear cart and redirect to success page
      this.cartService.clearCart();
        this.router.navigate(['/order-success']);
      } catch (error) {
        console.error('Error processing order:', error);
        // Handle error appropriately
      } finally {
        this.processing = false;
      }
    }
  }
}
