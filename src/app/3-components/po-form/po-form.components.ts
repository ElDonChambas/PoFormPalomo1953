import { Component, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../2-services/google-sheets.service';
import { ProductCategory, ProductVariant, CustomerInfo, Product, SizeOption } from '../../1-models/po.interface';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-form.component.html',
  styles: [`
    .suede-texture {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E");
    }
  `]
})
export class PoFormComponent {
  private sheetsService = inject(GoogleSheetsService);
  private cdr = inject(ChangeDetectorRef);

  isSubmitted = false;
  isLoading = false;
  selectedImage: string | null = null; 
  isSummaryOpen = false; 

  activeVariantIndices: { [styleName: string]: number } = {};

  customer: CustomerInfo = {
    companyName: '', contactName: '', email: '', phone: '', city: '', country: '', billingAddress: '', shippingAddress: ''
  };

  categories: ProductCategory[] = [
    {
      categoryName: 'Gold Label',
      description: 'Our Premium & Handcrafted Collection',
      styles: [
        {
          styleName: 'Edmund Plain Toe Boot',
          price: 140,
          variants: [
            { id: 'gold-edmund-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-edmund/gold-edmund-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-edmund-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-edmund/gold-edmund-brown.jpg', sizes: this.generateSizes() },
            { id: 'gold-edmund-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-edmund/gold-edmund-whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-edmund-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-edmund/gold-edmund-cola.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-edmund-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-edmund/gold-edmund-polo.jpg', sizes: this.generateSizes(), isSuede: true }
          ]
        }, 
        {
          styleName: 'Ernest Cap Toe Boot',
          price: 140,
          variants: [
            { id: 'gold-ernest-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-ernest/gold-ernest-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-ernest-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-ernest/gold-ernest-brown.jpg', sizes: this.generateSizes() },
            { id: 'gold-ernest-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-ernest/gold-ernest-whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-ernest-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-ernest/gold-ernest-cola.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-ernest-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-ernest/gold-ernest-polo.jpg', sizes: this.generateSizes(), isSuede: true }
          ]
        }, 
        {
          styleName: 'Sherman Chelsea Boot',
          price: 140,
          variants: [
            { id: 'gold-chelsea-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-sherman/gold-chelsea-Black.jpg', sizes: this.generateSizes() },
            { id: 'gold-chelsea-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-sherman/gold-chelsea-brown.jpg', sizes: this.generateSizes() },
            { id: 'gold-chelsea-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-sherman/gold-chelsea-Whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-chelsea-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-sherman/gold-chelsea-Natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-chelsea-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-sherman/gold-chelsea-Cola.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-chelsea-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-sherman/gold-chelsea-Polo.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-chelsea-visone', colorName: 'Visone', hexColor: '#887152', imageUrl: '/productos/gold-sherman/gold-chelsea-visone.jpg', sizes: this.generateSizes(), isSuede: true }
          ]
        },
        {
          styleName: 'Yukon Ranger Boot',
          price: 130,
          variants: [
            { id: 'gold-yukon-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-yukon/gold-yukon-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-yukon-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-yukon/gold-yukon-whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-yukon-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-yukon/gold-yukon-cola.jpg', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Crescent Camp Bootie',
          price: 115,
          variants: [
            { id: 'gold-crescent-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-crescent/gold-crescent-natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-crescent-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-crescent/gold-crescent-cola.jpg', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Vermont Camp Lug',
          price: 115,
          variants: [
            { id: 'gold-vermont-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-vermont/gold-vermont-natural.jpg', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Acadia Camp Moc',
          price: 95,
          variants: [
            { id: 'gold-acadia-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-acadia/gold-acadia-natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-acadia-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-acadia/gold-acadia-cola.jpg', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Baxter Camp Moc',
          price: 100,
          variants: [
            { id: 'gold-baxter-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-baxter/gold-baxter-natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-baxter-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-baxter/gold-baxter-cola.jpg', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'PALOMO® Loafer',
          price: 90,
          variants: [
            { id: 'gold-penny-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-penny/gold-penny-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-penny-color8', colorName: 'Color #8', hexColor: '#3A2411', imageUrl: '/productos/gold-penny/gold-penny-color8.jpg', sizes: this.generateSizes() },
            { id: 'gold-penny-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-penny/gold-penny-whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-penny-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-penny/gold-penny-cola.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-penny-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-penny/gold-penny-polo.jpg', sizes: this.generateSizes(), isSuede: true }
          ]
        },
        {
          styleName: 'James Slipper',
          price: 100,
          variants: [
            { id: 'gold-james-cacaosuede', colorName: 'Suede Toast', hexColor: '#B2702B', imageUrl: '/productos/gold-james/gold-james-suedetoast.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-james-waxypullup', colorName: 'Cacao Waxy Pull-up', hexColor: '#4D3B37', imageUrl: '/productos/gold-james/gold-james-waxy.jpg', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Columbus Boat Shoe',
          price: 130,
          variants: [
            { id: 'gold-columbus-blue', colorName: 'Deep Blue Grain', hexColor: '#403B5B', imageUrl: '/productos/gold-columbus/gold-columbus-blue.jpg', sizes: this.generateSizes() },
            { id: 'gold-columbus-green', colorName: 'Hunter Green', hexColor: '#5D5B31', imageUrl: '/productos/gold-columbus/gold-columbus-green.jpg', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-columbus-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-columbus/gold-columbus-natural.jpg', sizes: this.generateSizes() },
          ]
        }
      ]
    },
    {
      categoryName: 'Green Label',
      description: 'Everyday Classic Essentials',
      styles: [
        {
          styleName: 'Edmund Plain Toe Boot',
          price: 90,
          variants: [
            { id: 'green-edmund-black', colorName: 'Black Waxy Leather', hexColor: '#1a1a1a', imageUrl: '/productos/green-edmund-black.png', sizes: this.generateSizes() },
            { id: 'green-edmund-brown', colorName: 'Brown Waxy Leather', hexColor: '#5C4033', imageUrl: '', sizes: this.generateSizes() },
            { id: 'green-edmund-mesa', colorName: 'Mesa Suede', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes(), isSuede: true },
          ]
        }, 
      ]
    }
  ];

  generateSizes() {
    const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];
    return sizes.map(size => ({ size, quantity: 0 }));
  }

  updateQty(variant: ProductVariant, sizeIndex: number, change: number) {
    const currentQty = variant.sizes[sizeIndex].quantity;
    const newQty = currentQty + change;
    if (newQty >= 0) {
      variant.sizes[sizeIndex].quantity = newQty;
    }
  }

  // ---- FUNCIONES DEL CARRUSEL ----
  getVariantIndex(categoryName: string, styleName: string): number {
    const key = categoryName + '-' + styleName;
    return this.activeVariantIndices[key] || 0;
  }

  nextVariant(categoryName: string, styleName: string, length: number, event: Event) {
    event.stopPropagation();
    const key = categoryName + '-' + styleName;
    const current = this.getVariantIndex(categoryName, styleName);
    this.activeVariantIndices[key] = (current + 1) % length;
  }

  prevVariant(categoryName: string, styleName: string, length: number, event: Event) {
    event.stopPropagation();
    const key = categoryName + '-' + styleName;
    const current = this.getVariantIndex(categoryName, styleName);
    this.activeVariantIndices[key] = (current - 1 + length) % length;
  }

  openImage(url: string) {
    if (url) this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
  }

  get totalPairs(): number {
    let pairs = 0;
    for (const cat of this.categories) {
      for (const style of cat.styles) {
        for (const variant of style.variants) {
          if (variant.selected) {
            pairs += variant.sizes.reduce((sum: number, size: SizeOption) => sum + size.quantity, 0);
          }
        }
      }
    }
    return pairs;
  }

  get orderTotal(): number {
    let total = 0;
    for (const cat of this.categories) {
      for (const style of cat.styles) {
        for (const variant of style.variants) {
          if (variant.selected) {
            const variantQty = variant.sizes.reduce((sum: number, size: SizeOption) => sum + size.quantity, 0);
            total += (variantQty * style.price);
          }
        }
      }
    }
    return total;
  }

  get orderSummaryItems() {
    const items = [];
    for (const cat of this.categories) {
      for (const style of cat.styles) {
        for (const variant of style.variants) {
          if (variant.selected) {
            const selectedSizes = variant.sizes.filter((s: SizeOption) => s.quantity > 0);
            if (selectedSizes.length > 0) {
              const variantQty = selectedSizes.reduce((sum: number, size: SizeOption) => sum + size.quantity, 0);
              items.push({
                name: `${style.styleName} - ${variant.colorName}`,
                qty: variantQty,
                subtotal: variantQty * style.price,
                sizes: selectedSizes.map((s: SizeOption) => `Sz ${s.size} (${s.quantity})`).join(', ')
              });
            }
          }
        }
      }
    }
    return items;
  }

  submitOrder() {
    const c = this.customer;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const phoneRegex = /^[0-9\+\-\s]+$/; 

    if (!c.companyName || !c.contactName || !c.email || !c.phone || !c.city || !c.country || !c.billingAddress || !c.shippingAddress) {
      alert('Please fill out all Billing & Shipping Information before submitting.');
      return;
    }

    if (!emailRegex.test(c.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!phoneRegex.test(c.phone)) {
      alert('Please enter a valid phone number (numbers only).');
      return;
    }

    const orderedProducts: Product[] = [];
    
    for (const cat of this.categories) {
      for (const style of cat.styles) {
        for (const variant of style.variants) {
          if (variant.selected) {
            const selectedSizes = variant.sizes.filter((s: SizeOption) => s.quantity > 0);
            if (selectedSizes.length > 0) {
              orderedProducts.push({
                id: variant.id,
                name: `${style.styleName} - ${variant.colorName} (${cat.categoryName})`,
                price: style.price,
                imageUrl: variant.imageUrl,
                sizes: selectedSizes
              });
            }
          }
        }
      }
    }

    if (orderedProducts.length === 0) {
      alert('Please select at least one product color and specify the quantity.');
      return;
    }

    this.isLoading = true;

    this.sheetsService.submitPO(this.customer, orderedProducts).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error submitting order', err);
        this.isSubmitted = true; 
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }
}