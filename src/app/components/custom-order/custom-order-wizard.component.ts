import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CustomOrderService } from '../../services/custom-order.service';
import { Router } from '@angular/router';

interface CustomCandle {
  shape: string;
  size: string;
  color: string;
  scentPrimary: string;
  scentSecondary?: string;
  scentIntensity: number;
  container: string;
  label?: string;
  message?: string;
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
  steps = ['Shape & Size', 'Color & Container', 'Scent Profile', 'Personalization'];
  currentStep = 0;
  showPreviewFlame = false;
  formValid = false;
  previewLoading = false;

  shapes = [
    { value: 'classic', label: 'Classic Cylinder', icon: 'fas fa-circle', previewImage: '/assets/images/Products/Lavender Bliss Candle.jpg' },
    { value: 'geometric', label: 'Geometric', icon: 'fas fa-gem', previewImage: '/assets/images/Products/Midnight Oud 1.jpg' },
    { value: 'heart', label: 'Heart', icon: 'fas fa-heart', previewImage: '/assets/images/Products/Rose Garden Delight.jpg' }
  ];

  sizes = [
    { value: 'small', label: 'Small', volume: '4 oz', icon: 'fas fa-baby', price: 20 },
    { value: 'medium', label: 'Medium', volume: '8 oz', icon: 'fas fa-child', price: 30 },
    { value: 'large', label: 'Large', volume: '16 oz', icon: 'fas fa-adult', price: 45 }
  ];

  colors = [
    { value: '#FFFFFF', label: 'White', previewImage: '/assets/images/Products/Lavender Bliss Candle.jpg' },
    { value: '#F8C3CD', label: 'Rose', previewImage: '/assets/images/Products/Rose Garden Delight.jpg' },
    { value: '#E7C697', label: 'Sand', previewImage: '/assets/images/Products/Coconut Driftwood.jpg' },
    { value: '#8A9A5B', label: 'Sage', previewImage: '/assets/images/Products/Forest Pine Essence.jpg' },
    { value: '#B4A582', label: 'Clay', previewImage: '/assets/images/Products/Ocean Mist Glow.jpg' },
    { value: '#D4AF37', label: 'Gold', previewImage: '/assets/images/Products/Saffron Sunset.jpg' }
  ];

  containers = [
    { value: 'glass', label: 'Clear Glass', image: '/assets/images/containers/glass.svg', price: 0 },
    { value: 'ceramic', label: 'Ceramic', image: '/assets/images/containers/ceramic.svg', price: 10 },
    { value: 'metal', label: 'Metal Tin', image: '/assets/images/containers/metal.svg', price: 5 },
    { value: 'metal', label: 'Metal Tin', image: '/assets/images/containers/package2.jpg', price: 15 },
  ];

  scents = [
    { value: 'lavender', label: 'Lavender', icon: 'fas fa-spa', previewImage: '/assets/images/Products/Lavender Bliss Candle.jpg' },
    { value: 'vanilla', label: 'Vanilla', icon: 'fas fa-cookie', previewImage: '/assets/images/Products/Coconut Driftwood.jpg' },
    { value: 'citrus', label: 'Citrus', icon: 'fas fa-lemon', previewImage: '/assets/images/Products/Citrus Sunrise 1.jpg' },
    { value: 'wood', label: 'Wood', icon: 'fas fa-tree', previewImage: '/assets/images/Products/Forest Pine Essence.jpg' },
    { value: 'floral', label: 'Floral', icon: 'fas fa-flower', previewImage: '/assets/images/Products/Rose Garden Delight.jpg' }
  ];

  labelStyles = [
    { value: 'classic', label: 'Classic', icon: 'fas fa-tag' },
    { value: 'modern', label: 'Modern', icon: 'fas fa-square' },
    { value: 'vintage', label: 'Vintage', icon: 'fas fa-scroll' }
  ];

  candleForm!: FormGroup;
  currentPreviewImage: string = this.shapes[0].previewImage;

  constructor(
    private fb: FormBuilder,
    private customOrderService: CustomOrderService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.candleForm = this.fb.group({
      shape: ['classic', Validators.required],
      size: ['medium', Validators.required],
      color: ['#FFFFFF', Validators.required],
      container: ['glass', Validators.required],
      scentPrimary: ['lavender', Validators.required],
      scentIntensity: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      message: ['', [Validators.maxLength(50)]],
      label: ['classic']
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
      case 0: // Shape & Size
        this.formValid = controls['shape'].valid && controls['size'].valid;
        break;
      case 1: // Color & Container
        this.formValid = controls['color'].valid && controls['container'].valid;
        break;
      case 2: // Scent Profile
        this.formValid = controls['scentPrimary'].valid && controls['scentIntensity'].valid;
        break;
      case 3: // Personalization
        this.formValid = true; // Always valid as these are optional
        break;
      default:
        this.formValid = false;
    }
  }

  updatePreview(): void {
    this.previewLoading = true;
    const formValues = this.candleForm.value;
    
    // Determine which preview image to show based on current selections
    let previewImage = '';
    
    if (this.currentStep === 0) {
      const selectedShape = this.shapes.find(s => s.value === formValues.shape);
      previewImage = selectedShape?.previewImage || this.currentPreviewImage;
    } else if (this.currentStep === 1) {
      const selectedColor = this.colors.find(c => c.value === formValues.color);
      const selectedContainer = this.containers.find(c => c.value === formValues.container);
      previewImage = selectedContainer?.image || selectedColor?.previewImage || this.currentPreviewImage;
    } else if (this.currentStep === 2) {
      const selectedScent = this.scents.find(s => s.value === formValues.scentPrimary);
      previewImage = selectedScent?.previewImage || this.currentPreviewImage;
    }
    
    if (previewImage) {
      this.currentPreviewImage = previewImage;
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
    
    // Container pricing
    const selectedContainer = this.containers.find(c => c.value === formValues.container);
    basePrice += selectedContainer?.price || 0;
    
    // Custom message
    if (formValues.message) {
      basePrice += 8;
    }
    
    // Scent intensity
    basePrice += (formValues.scentIntensity - 1) * 2;
    
    return basePrice;
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
      const customCandle: CustomCandle = {
        ...this.candleForm.value,
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

  togglePreviewFlame() {
    this.showPreviewFlame = !this.showPreviewFlame;
  }
} 