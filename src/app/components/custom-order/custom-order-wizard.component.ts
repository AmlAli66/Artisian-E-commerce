import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CustomOrderService } from '../../services/custom-order.service';
import { Router } from '@angular/router';

interface ImageItem {
  path: string;
  value: string;
  label: string;
  price?: number;
}

interface CustomCandle {
  type: 'direct' | 'container';
  shape: string;
  size: string;
  color: string;
  scentPrimary: string;
  scentIntensity: number;
  container?: string;
  message?: string;
  font?: string;
  price: number;
}

@Component({
  selector: 'app-custom-order-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './custom-order-wizard.component.html',
  styleUrls: ['./custom-order-wizard.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('void', style({ 
        transform: 'translateX(50px)',
        opacity: 0 
      })),
      state('*', style({ 
        transform: 'translateX(0)',
        opacity: 1 
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ 
          transform: 'translateX(-50px)',
          opacity: 0 
        }))
      ])
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CustomOrderWizardComponent implements OnInit {
  protected readonly Math = Math;
  steps = ['Candle Type', 'Color & Size', 'Scent Profile', 'Personalization'];
  currentStep = 0;
  formValid = false;
  previewLoading = false;
  itemsPerGroup = 5; // Default for larger screens - 5 items per row
  
  @HostListener('window:resize')
  onResize() {
    // Update items per group based on screen size
    if (window.innerWidth < 576) {
      this.itemsPerGroup = 2; // Show 2 items on very small screens
    } else if (window.innerWidth < 768) {
      this.itemsPerGroup = 3; // Show 3 items on medium screens
    } else if (window.innerWidth < 992) {
      this.itemsPerGroup = 4; // Show 4 items on large screens
    } else {
      this.itemsPerGroup = 5; // Show 5 items on extra large screens
    }
  }

  // Dynamic image arrays
  shapeImages: ImageItem[] = [
    { path: '/assets/images/shapes/shape 1.jpg', value: 'shape 1', label: 'Classic Shape' },
    { path: '/assets/images/shapes/shape 2.jpg', value: 'shape 2', label: 'Modern Shape' },
    { path: '/assets/images/shapes/shape 3.jpg', value: 'shape 3', label: 'Elegant Shape' },
    { path: '/assets/images/shapes/shape 4.jpg', value: 'shape 4', label: 'Geometric Shape' },
    { path: '/assets/images/shapes/shape 5.jpg', value: 'shape 5', label: 'Artistic Shape' },
    { path: '/assets/images/shapes/shape 6.jpg', value: 'shape 6', label: 'Contemporary Shape' },
    { path: '/assets/images/shapes/shape 7.jpg', value: 'shape 7', label: 'Minimalist Shape' },
    { path: '/assets/images/shapes/shape 8.jpg', value: 'shape 8', label: 'Decorative Shape' },
    { path: '/assets/images/shapes/shape 9.jpg', value: 'shape 9', label: 'Unique Shape' },
    { path: '/assets/images/shapes/shape 10.jpg', value: 'shape 10', label: 'Premium Shape' },
    { path: '/assets/images/shapes/shape 11.jpg', value: 'shape 11', label: 'Luxury Shape' },
    { path: '/assets/images/shapes/shape 12.jpg', value: 'shape 12', label: 'Designer Shape' }
  ];

  containerImages: ImageItem[] = [
    { path: 'assets/images/containers/glass.jpg', value: 'glass', label: 'Classic Glass', price: 0 },
    // { path: '/assets/images/containers/premium.jpg', value: 'premium', label: 'Premium Container', price: 15 },
    // { path: '/assets/images/containers/modern.jpg', value: 'modern', label: 'Modern Design', price: 12 },
    // { path: '/assets/images/containers/elegant.jpg', value: 'elegant', label: 'Elegant Container', price: 18 },
    { path: '/assets/images/containers/luxury.jpg', value: 'luxury', label: 'Luxury Edition', price: 25 },
    { path: '/assets/images/containers/vintage.jpg', value: 'vintage', label: 'Vintage Style', price: 20 },
    { path: '/assets/images/containers/artisan.jpg', value: 'artisan', label: 'Artisan Collection', price: 22 },
    { path: '/assets/images/containers/designer.jpg', value: 'designer', label: 'Designer Series', price: 28 }
  ];

  sizes = [
    { value: 'small', label: 'Small', volume: '4 oz', price: 20 },
    { value: 'medium', label: 'Medium', volume: '8 oz', price: 30 },
    { value: 'large', label: 'Large', volume: '16 oz', price: 45 }
  ];

  colors = [
    { value: '#FFFFFF', label: 'White' },
    { value: '#F8C3CD', label: 'Rose' },
    { value: '#E7C697', label: 'Sand' },
    { value: '#8A9A5B', label: 'Sage' },
    { value: '#B4A582', label: 'Clay' },
    { value: '#D4AF37', label: 'Gold' }
  ];

  scents = [
    { value: 'lavender', label: 'Lavender', icon: 'fas fa-spa' },
    { value: 'vanilla', label: 'Vanilla', icon: 'fas fa-cookie' },
    { value: 'citrus', label: 'Citrus', icon: 'fas fa-lemon' },
    { value: 'wood', label: 'Wood', icon: 'fas fa-tree' },
    { value: 'floral', label: 'Floral', icon: 'fas fa-flower' }
  ];

  fonts = [
    { value: 'playfair', label: 'Playfair Display', class: 'font-playfair' },
    { value: 'montserrat', label: 'Montserrat', class: 'font-montserrat' },
    { value: 'dancing', label: 'Dancing Script', class: 'font-dancing' }
  ];

  candleForm!: FormGroup;
  currentPreviewImage: string = this.shapeImages[0].path;

  constructor(
    private fb: FormBuilder,
    private customOrderService: CustomOrderService,
    private router: Router
  ) {
    this.initializeForm();
    this.onResize(); // Initialize itemsPerGroup based on screen size
  }

  private initializeForm() {
    this.candleForm = this.fb.group({
      type: ['direct', Validators.required],
      shape: ['', Validators.required],
      container: [''],
      size: ['medium', Validators.required],
      color: ['#FFFFFF', Validators.required],
      scentPrimary: ['lavender', Validators.required],
      scentIntensity: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      message: ['', [Validators.maxLength(50)]],
      font: ['playfair']
    });

    // Add conditional validation for container
    this.candleForm.get('type')?.valueChanges.subscribe(type => {
      const containerControl = this.candleForm.get('container');
      const shapeControl = this.candleForm.get('shape');
      
      if (type === 'container') {
        containerControl?.setValidators(Validators.required);
        shapeControl?.clearValidators();
      } else {
        containerControl?.clearValidators();
        shapeControl?.setValidators(Validators.required);
      }
      
      containerControl?.updateValueAndValidity();
      shapeControl?.updateValueAndValidity();
    });

    // Subscribe to form changes for validation and preview updates
    this.candleForm.valueChanges.subscribe(() => {
      this.updatePreview();
      this.validateCurrentStep();
    });
  }

  ngOnInit() {
    this.validateCurrentStep();
    this.updatePreview();
  }

  private validateCurrentStep(): void {
    const controls = this.candleForm.controls;
    switch (this.currentStep) {
      case 0: // Candle Type
        if (controls['type'].value === 'direct') {
          this.formValid = controls['shape'].valid;
        } else {
          this.formValid = controls['container'].valid;
        }
        break;
      case 1: // Color & Size
        this.formValid = controls['color'].valid && controls['size'].valid;
        break;
      case 2: // Scent Profile
        this.formValid = controls['scentPrimary'].valid && controls['scentIntensity'].valid;
        break;
      case 3: // Personalization
        this.formValid = true; // Optional step
        break;
      default:
        this.formValid = false;
    }
  }

  updatePreview(): void {
    this.previewLoading = true;
    const formValues = this.candleForm.value;
    
    // Update preview image based on selection
    if (formValues.type === 'direct') {
      const selectedShape = this.shapeImages.find(s => s.value === formValues.shape);
      if (selectedShape) {
        this.currentPreviewImage = selectedShape.path;
      }
    } else {
      const selectedContainer = this.containerImages.find(c => c.value === formValues.container);
      if (selectedContainer) {
        this.currentPreviewImage = selectedContainer.path;
      }
    }
    
    setTimeout(() => {
      this.previewLoading = false;
    }, 300);
  }

  calculatePrice(): number {
    let basePrice = 0;
    const formValues = this.candleForm.value;
    
    // Size pricing
    const selectedSize = this.sizes.find(s => s.value === formValues.size);
    basePrice += selectedSize?.price || 0;
    
    // Container pricing if applicable
    if (formValues.type === 'container') {
      const selectedContainer = this.containerImages.find(c => c.value === formValues.container);
      basePrice += selectedContainer?.price || 0;
    }
    
    // Custom message
    if (formValues.message) {
      basePrice += 8;
    }
    
    // Scent intensity
    basePrice += (formValues.scentIntensity - 1) * 2;
    
    return basePrice;
  }

  getImageGroups(): ImageItem[][] {
    const images = this.getCurrentImages();
    const groups: ImageItem[][] = [];
    
    for (let i = 0; i < images.length; i += this.itemsPerGroup) {
      groups.push(images.slice(i, i + this.itemsPerGroup));
    }
    
    return groups;
  }

  getCurrentImages(): ImageItem[] {
    return this.candleForm.get('type')?.value === 'direct' ? this.shapeImages : this.containerImages;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1 && this.formValid) {
      this.currentStep++;
      this.validateCurrentStep();
      this.updatePreview();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.validateCurrentStep();
      this.updatePreview();
    }
  }

  onSubmit() {
    if (this.candleForm.valid) {
      const formValues = this.candleForm.value;
      
      // Create the custom candle object with required properties
      const customCandle = {
        type: formValues.type,
        shape: formValues.type === 'direct' ? formValues.shape : 'container',
        size: formValues.size,
        color: formValues.color,
        scentPrimary: formValues.scentPrimary,
        scentIntensity: formValues.scentIntensity,
        container: formValues.type === 'container' ? formValues.container : 'none',
        message: formValues.message || '',
        font: formValues.font || 'playfair',
        price: this.calculatePrice()
      };
      
      this.customOrderService.addCustomOrder(customCandle);
      this.router.navigate(['/cart']);
    }
  }

  resetForm() {
    this.initializeForm();
    this.currentStep = 0;
    this.validateCurrentStep();
    this.updatePreview();
  }

  isOptionSelected(optionValue: string, controlName: string): boolean {
    return this.candleForm.get(controlName)?.value === optionValue;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/placeholder.jpg';
    }
  }
} 