import { Component, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../2-services/google-sheets.service';
import { ProductCategory, ProductVariant, CustomerInfo, Product, SizeOption } from '../../1-models/po.interface';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-form.component.html'
})
export class PoFormComponent {
  private sheetsService = inject(GoogleSheetsService);
  private cdr = inject(ChangeDetectorRef);

  isSubmitted = false;
  isLoading = false;
  selectedImage: string | null = null; 

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
            { id: 'gold-edmund-black', colorName: 'Black', hexColor: '#1a1a1a', imageUrl: '/productos/gold-edmund-whiskey.jpg', sizes: this.generateSizes() },
            { id: 'gold-edmund-brown', colorName: 'Brown', hexColor: '#5C4033', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-edmund-whiskey', colorName: 'Whiskey', hexColor: '#C68E58', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-edmund-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-edmund-polo', colorName: 'Polo', hexColor: '#663333', imageUrl: '', sizes: this.generateSizes() }
          ]
        }, 
        {
          styleName: 'Ernest Cap Toe Boot',
          price: 140,
          variants: [
            { id: 'gold-ernest-black', colorName: 'Black', hexColor: '#1a1a1a', imageUrl: '/productos/gold-ernest-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-ernest-brown', colorName: 'Brown', hexColor: '#5C4033', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-ernest-whiskey', colorName: 'Whiskey', hexColor: '#C68E58', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-ernest-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-ernest-polo', colorName: 'Polo', hexColor: '#663333', imageUrl: '', sizes: this.generateSizes() }
          ]
        }, 
        {
          styleName: 'Sherman Chelsea Boot',
          price: 140,
          variants: [
            { id: 'gold-chelsea-black', colorName: 'Black', hexColor: '#1a1a1a', imageUrl: '/productos/gold-chelsea-brown.jpg', sizes: this.generateSizes() },
            { id: 'gold-chelsea-brown', colorName: 'Brown', hexColor: '#5C4033', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-chelsea-whiskey', colorName: 'Whiskey', hexColor: '#C68E58', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-chelsea-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-chelsea-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-chelsea-polo', colorName: 'Polo', hexColor: '#663333', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-chelsea-visone', colorName: 'Visone', hexColor: '#663333', imageUrl: '', sizes: this.generateSizes() }
          ]
        },
        {
          styleName: 'Yukon Ranger Boot',
          price: 130,
          variants: [
            { id: 'gold-yukon-black', colorName: 'Black', hexColor: '#1a1a1a', imageUrl: '/productos/gold-yukon-cola.jpg', sizes: this.generateSizes() },
            { id: 'gold-yukon-brown', colorName: 'Brown', hexColor: '#5C4033', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-yukon-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Crescent Camp Bootie',
          price: 115,
          variants: [
            { id: 'gold-crescent-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '/productos/gold-crescent-natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-crescent-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Vermont Camp Lug',
          price: 115,
          variants: [
            { id: 'gold-vermont-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '/productos/gold-vermont-natural.jpg', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Acadia Camp Moc',
          price: 95,
          variants: [
            { id: 'gold-acadia-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '/productos/gold-acadia-natural.jpg', sizes: this.generateSizes() },
            { id: 'gold-acadia-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Baxter Camp Moc',
          price: 100,
          variants: [
            { id: 'gold-baxter-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '/productos/gold-baxter-cola.jpg', sizes: this.generateSizes() },
            { id: 'gold-baxter-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'PALOMO® Loafer',
          price: 90,
          variants: [
            { id: 'gold-penny-black', colorName: 'Black', hexColor: '#1a1a1a', imageUrl: '/productos/gold-penny-black.jpg', sizes: this.generateSizes() },
            { id: 'gold-penny-color8', colorName: 'Color #8', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-penny-whiskey', colorName: 'Whiskey', hexColor: '#C68E58', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-penny-cola', colorName: 'Cola', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-penny-polo', colorName: 'Polo', hexColor: '#663333', imageUrl: '', sizes: this.generateSizes() }
          ]
        },
        {
          styleName: 'James Slipper',
          price: 100,
          variants: [
            { id: 'gold-james-cacaosuede', colorName: 'Cacao Suede', hexColor: '#E6C280', imageUrl: '/productos/gold-james-cacao.jpg', sizes: this.generateSizes() },
            { id: 'gold-james-waxypullup', colorName: 'Waxy Pull-up', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Columbus Boat Shoe',
          price: 130,
          variants: [
            { id: 'gold-columbus-blue', colorName: 'Deep Blue Grain', hexColor: '#4A90E2', imageUrl: '/productos/gold-columbus-blue.jpg', sizes: this.generateSizes() },
            { id: 'gold-columbus-green', colorName: 'Hunter Green', hexColor: '#2E8B57', imageUrl: '', sizes: this.generateSizes() },
            { id: 'gold-columbus-natural', colorName: 'Natural', hexColor: '#E6C280', imageUrl: '', sizes: this.generateSizes() },
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
            { id: 'green-edmund-mesa', colorName: 'Mesa Suede', hexColor: '#3A2411', imageUrl: '', sizes: this.generateSizes() },
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

  openImage(url: string) {
    this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
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