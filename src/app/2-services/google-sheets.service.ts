import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerInfo, Product } from '../1-models/po.interface';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private http = inject(HttpClient);
  
  // Tu URL de Google Apps Script (¡Asegúrate de que sea la correcta!)
  private scriptUrl = 'https://script.google.com/macros/s/AKfycbzZr1I_p3YLaK2QDtiiFdXrgvpraDLXvhFzMYBh30rJgDCRLsS3zmuZDFGyM1lu6Xmf/exec'; 

  submitPO(customer: CustomerInfo, products: Product[]) {
    const payload = { customer, products };
    
    // Al enviar como text/plain evitamos el pre-flight CORS estricto de JSON
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=utf-8'
    });

    // Convertimos el payload a un string (texto plano)
    return this.http.post(this.scriptUrl, JSON.stringify(payload), { headers, responseType: 'text' });
  }
}