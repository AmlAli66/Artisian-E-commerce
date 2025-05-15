import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem as ServiceCartItem } from '../../services/cart.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

// Extend the service's CartItem type
type CartItem = ServiceCartItem;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  currentStep: number = 1;
  processing: boolean = false;
  isMobile: boolean = false;
  private destroy$ = new Subject<void>();
  private resizeTimeout: any;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  @HostListener('window:resize')
  onResize() {
    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.checkScreenSize();
    }, 250);
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadCartItems();
    
    // Subscribe to form value changes for real-time validation
    this.checkoutForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateCurrentStep();
      });

    // Subscribe to cart changes
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  ngAfterViewInit(): void {
    // Initialize any third-party components or perform DOM manipulations
    setTimeout(() => {
      this.updateStepUI();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to input property changes
    if (changes['cartItems']) {
      this.calculateTotal();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and event listeners
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
  }

  private loadCartItems(): void {
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.cartItems = items;
          this.calculateTotal();
          if (items.length === 0) {
            this.router.navigate(['/cart']);
    }
        },
        error: (error) => {
          console.error('Error loading cart items:', error);
          // Handle error appropriately
        }
      });
  }

  private calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  validateCurrentStep(): boolean {
    const formControls = this.checkoutForm.controls;
    switch (this.currentStep) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
          .every(field => formControls[field].valid);
      case 2:
        return ['cardNumber', 'cardExpiry', 'cardCvv']
          .every(field => formControls[field].valid);
      default:
        return true;
    }
  }

  nextStep(): void {
    if (this.currentStep < 3 && this.validateCurrentStep()) {
      this.currentStep++;
      this.updateStepUI();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  }

  private updateStepUI(): void {
    const stepElements = document.querySelectorAll('.step');
    stepElements.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid && !this.processing) {
      this.processing = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear cart and redirect to success page
      this.cartService.clearCart();
        this.router.navigate(['/checkout/success'], {
          state: {
            orderDetails: {
              ...this.checkoutForm.value,
              items: this.cartItems,
              total: this.cartTotal
            }
          }
        });
      } catch (error) {
        console.error('Error processing order:', error);
        // Handle error appropriately
      } finally {
        this.processing = false;
      }
    }
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const control = this.checkoutForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'phone':
            return 'Please enter a valid phone number';
          case 'zipCode':
            return 'Please enter a valid ZIP code';
          case 'cardNumber':
            return 'Please enter a valid 16-digit card number';
          case 'cardExpiry':
            return 'Please enter a valid expiry date (MM/YY)';
          case 'cardCvv':
            return 'Please enter a valid CVV';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  // Format helpers
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.substr(0, 16);
    }
    event.target.value = value;
  }

  formatExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substr(0, 2) + '/' + value.substr(2);
    }
    if (value.length > 5) {
      value = value.substr(0, 5);
    }
    event.target.value = value;
  }
}

