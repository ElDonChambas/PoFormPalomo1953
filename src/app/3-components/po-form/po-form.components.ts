import { Component, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../2-services/google-sheets.service';
import { Product, CustomerInfo } from '../../1-models/po.interface';

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
  selectedImage: string | null = null; // Controla qué imagen se ve en grande

  customer: CustomerInfo = {
    companyName: '', contactName: '', email: '', phone: '', city: '', country: '', billingAddress: '', shippingAddress: ''
  };

  products: Product[] = [
    {
      id: 'gold-edmund-black', name: 'Edmund Plain Toe Boot Black', price: 140, imageUrl: '/productos/gold-edmund-black.jpg',
      sizes: this.generateSizes()
    },
    {
      id: 'gold-edmund-brown', name: 'Edmund Plain Toe Boot Brown', price: 140, imageUrl: '/productos/gold-edmund-brown.jpg',
      sizes: this.generateSizes()
    },
    {
      id: 'gold-edmund-whiskey', name: 'Edmund Plain Toe Boot Whiskey', price: 140, imageUrl: '/productos/gold-edmund-whiskey.jpg',
      sizes: this.generateSizes()
    }
  ];

  generateSizes() {
    const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];
    return sizes.map(size => ({ size, quantity: 0 }));
  }

  updateQty(product: Product, sizeIndex: number, change: number) {
    const currentQty = product.sizes[sizeIndex].quantity;
    const newQty = currentQty + change;
    if (newQty >= 0) {
      product.sizes[sizeIndex].quantity = newQty;
    }
  }

  // Abre el modal con la imagen seleccionada
  openImage(url: string) {
    this.selectedImage = url;
  }

  // Cierra el modal
  closeImage() {
    this.selectedImage = null;
  }

  // Solo suma los productos que están seleccionados
  get orderTotal(): number {
    return this.products.reduce((total, product) => {
      if (!product.selected) return total;
      const productQty = product.sizes.reduce((sum, size) => sum + size.quantity, 0);
      return total + (productQty * product.price);
    }, 0);
  }

  submitOrder() {
    const c = this.customer;
    
    // Validaciones Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const phoneRegex = /^[0-9\+\-\s]+$/; // Permite números, espacios y signos + o -

    // 1. Validar vacíos
    if (!c.companyName || !c.contactName || !c.email || !c.phone || !c.city || !c.country || !c.billingAddress || !c.shippingAddress) {
      alert('Please fill out all Billing & Shipping Information before submitting.');
      return;
    }

    // 2. Validar formato de email
    if (!emailRegex.test(c.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // 3. Validar formato de teléfono
    if (!phoneRegex.test(c.phone)) {
      alert('Please enter a valid phone number (numbers only).');
      return;
    }

    const orderedProducts = this.products
      .filter(p => p.selected)
      .map(p => ({
        ...p,
        sizes: p.sizes.filter(s => s.quantity > 0)
      })).filter(p => p.sizes.length > 0);

    if (orderedProducts.length === 0) {
      alert('Please select at least one product and specify the quantity.');
      return;
    }

    this.isLoading = true;

    this.sheetsService.submitPO(this.customer, orderedProducts).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- Obligamos a Angular a mostrar el "Thank you" inmediatamente
      },
      error: (err) => {
        console.error('Error submitting order', err);
        this.isSubmitted = true; 
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- Obligamos a Angular a actualizar
      }
    });
  }
}