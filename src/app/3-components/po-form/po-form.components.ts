import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../2-services/google-sheets.service';
import { ProductCategory, ProductVariant, CustomerInfo, Product, SizeOption, ProductStyle } from '../../1-models/po.interface';

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
export class PoFormComponent implements OnInit {
  private sheetsService = inject(GoogleSheetsService);
  private cdr = inject(ChangeDetectorRef);

  isSubmitted = false;
  isLoading = false;
  selectedImage: string | null = null; 
  isSummaryOpen = false; 

  isModalOpen = false;
  isCartModalOpen = false;

  modalData: { categoryName: string, style: ProductStyle | null, currentIndex: number } = { categoryName: '', style: null, currentIndex: 0 };

  activeVariantIndices: { [styleName: string]: number } = {};

  customer: CustomerInfo = {
    companyName: '', contactName: '', email: '', phone: '', city: '', country: '', billingAddress: '', shippingAddress: ''
  };

  ngOnInit() {
    console.log(
      "%c🚀 Built with Angular by Rodrigo Ávila\n%cLet's connect: https://eldonchambas.github.io/PersonalWebsiteEnglishRodrigoAvila/",
      "font-size: 14px; font-weight: bold; color: #FFFFFF;",
      "font-size: 12px; color: gray;"
    );
  }

  categories: ProductCategory[] = [
    {categoryName: 'Gold Label',
      description: 'Our Premium & Handcrafted Collection',
      styles: [
        {
          styleName: 'Edmund Plain Toe Boot',
          price: 167,
          variants: [
            { id: 'gold-edmund-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-edmund/gold-edmund-black.webp', sizes: this.generateSizes() },
            { id: 'gold-edmund-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-edmund/gold-edmund-brown.webp', sizes: this.generateSizes() },
            { id: 'gold-edmund-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-edmund/gold-edmund-whiskey.webp', sizes: this.generateSizes() },
            { id: 'gold-edmund-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-edmund/gold-edmund-cola.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-edmund-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-edmund/gold-edmund-polo.webp', sizes: this.generateSizes(), isSuede: true }
          ]
        }, 
        {
          styleName: 'Ernest Cap Toe Boot',
          price: 167,
          variants: [
            { id: 'gold-ernest-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-ernest/gold-ernest-black.webp', sizes: this.generateSizes() },
            { id: 'gold-ernest-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-ernest/gold-ernest-brown.webp', sizes: this.generateSizes() },
            { id: 'gold-ernest-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-ernest/gold-ernest-whiskey.webp', sizes: this.generateSizes() },
            { id: 'gold-ernest-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-ernest/gold-ernest-cola.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-ernest-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-ernest/gold-ernest-polo.webp', sizes: this.generateSizes(), isSuede: true }
          ]
        }, 
        {
          styleName: 'Sherman Chelsea Boot',
          price: 167,
          variants: [
            { id: 'gold-chelsea-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-sherman/gold-chelsea-Black.webp', sizes: this.generateSizes() },
            { id: 'gold-chelsea-brown', colorName: 'Brown', hexColor: '#4D3B37', imageUrl: '/productos/gold-sherman/gold-chelsea-brown.webp', sizes: this.generateSizes() },
            { id: 'gold-chelsea-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-sherman/gold-chelsea-Whiskey.webp', sizes: this.generateSizes() },
            { id: 'gold-chelsea-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-sherman/gold-chelsea-Natural.webp', sizes: this.generateSizes() },
            { id: 'gold-chelsea-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-sherman/gold-chelsea-Cola.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-chelsea-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-sherman/gold-chelsea-Polo.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-chelsea-visone', colorName: 'Visone', hexColor: '#887152', imageUrl: '/productos/gold-sherman/gold-chelsea-visone.webp', sizes: this.generateSizes(), isSuede: true }
          ]
        },
        {
          styleName: 'Yukon Ranger Boot',
          price: 130,
          variants: [
            { id: 'gold-yukon-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-yukon/gold-yukon-black.webp', sizes: this.generateSizes() },
            { id: 'gold-yukon-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-yukon/gold-yukon-whiskey.webp', sizes: this.generateSizes() },
            { id: 'gold-yukon-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-yukon/gold-yukon-cola.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Crescent Camp Bootie',
          price: 115,
          variants: [
            { id: 'gold-crescent-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-crescent/gold-crescent-natural.webp', sizes: this.generateSizes() },
            { id: 'gold-crescent-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-crescent/gold-crescent-cola.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Vermont Camp Lug',
          price: 115,
          variants: [
            { id: 'gold-vermont-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-vermont/gold-vermont-natural.webp', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Acadia Camp Moc',
          price: 95,
          variants: [
            { id: 'gold-acadia-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-acadia/gold-acadia-natural.webp', sizes: this.generateSizes() },
            { id: 'gold-acadia-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-acadia/gold-acadia-cola.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Baxter Camp Moc',
          price: 100,
          variants: [
            { id: 'gold-baxter-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-baxter/gold-baxter-natural.webp', sizes: this.generateSizes() },
            { id: 'gold-baxter-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-baxter/gold-baxter-cola.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'PALOMO® Loafer',
          price: 133.50,
          variants: [
            { id: 'gold-penny-black', colorName: 'Black', hexColor: '#1D1D1D', imageUrl: '/productos/gold-penny/gold-penny-black.webp', sizes: this.generateSizes() },
            { id: 'gold-penny-color8', colorName: 'Color #8', hexColor: '#3A2411', imageUrl: '/productos/gold-penny/gold-penny-color8.webp', sizes: this.generateSizes() },
            { id: 'gold-penny-whiskey', colorName: 'Whiskey', hexColor: '#70554A', imageUrl: '/productos/gold-penny/gold-penny-whiskey.webp', sizes: this.generateSizes() },
            { id: 'gold-penny-cola', colorName: 'Cola', hexColor: '#6B4424', imageUrl: '/productos/gold-penny/gold-penny-cola.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-penny-polo', colorName: 'Polo', hexColor: '#4D2E21', imageUrl: '/productos/gold-penny/gold-penny-polo.webp', sizes: this.generateSizes(), isSuede: true }
          ]
        },
/*
        {
          styleName: 'James Slipper',
          price: 90,
          variants: [
            { id: 'gold-james-cacaosuede', colorName: 'Suede Toast', hexColor: '#B2702B', imageUrl: '/productos/gold-james/gold-james-suedetoast.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-james-waxypullup', colorName: 'Cacao Waxy Pull-up', hexColor: '#4D3B37', imageUrl: '/productos/gold-james/gold-james-waxy.webp', sizes: this.generateSizes() },
          ]
        },
*/
        {
          styleName: 'Columbus Boat Shoe',
          price: 86,
          variants: [
            { id: 'gold-columbus-blue', colorName: 'Deep Blue Grain', hexColor: '#403B5B', imageUrl: '/productos/gold-columbus/gold-columbus-blue.webp', sizes: this.generateSizes() },
            { id: 'gold-columbus-green', colorName: 'Hunter Green', hexColor: '#5D5B31', imageUrl: '/productos/gold-columbus/gold-columbus-green.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'gold-columbus-natural', colorName: 'Natural', hexColor: '#A1866B', imageUrl: '/productos/gold-columbus/gold-columbus-natural.webp', sizes: this.generateSizes() },
          ]
        }
      ]
    },
    {categoryName: 'Green Label',
      description: 'Everyday Classic Essentials',
      styles: [
        {
          styleName: 'Edmund Plain Toe Boot',
          price: 90,
          variants: [
            { id: 'green-edmund-black', colorName: 'Black Waxy Leather', hexColor: '#1a1a1a', imageUrl: '/productos/green-edmund/green-edmund-black.webp', sizes: this.generateSizes() },
            { id: 'green-edmund-brown', colorName: 'Brown Waxy Leather', hexColor: '#5C4033', imageUrl: '/productos/green-edmund/green-edmund-brown.webp', sizes: this.generateSizes() },
            { id: 'green-edmund-mesa', colorName: 'Mesa Suede', hexColor: '#866D37', imageUrl: '/productos/green-edmund/green-edmund-mesa.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        }, 
        {
          styleName: 'Ernest Cap Toe Boot',
          price: 90,
          variants: [
            { id: 'green-ernest-black', colorName: 'Black Waxy Leather', hexColor: '#1a1a1a', imageUrl: '/productos/green-ernest/green-ernest-black.webp', sizes: this.generateSizes() },
            { id: 'green-ernest-brown', colorName: 'Brown Waxy Leather', hexColor: '#5C4033', imageUrl: '/productos/green-ernest/green-ernest-brown.webp', sizes: this.generateSizes() },
            { id: 'green-ernest-natural', colorName: 'Natural Waxy Leather', hexColor: '#A1866B', imageUrl: '/productos/green-ernest/green-ernest-natural.webp', sizes: this.generateSizes() },
            { id: 'green-ernest-lava-stone', colorName: 'Lava Stone', hexColor: '#343734', imageUrl: '/productos/green-ernest/green-ernest-lava-stone.webp', sizes: this.generateSizes() },
            { id: 'green-ernest-cinder', colorName: 'Cinder Brown Waxy Suede', hexColor: '#6E5F41', imageUrl: '/productos/green-ernest/green-ernest-cinder-brown.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Sherman Chelsea Boot',
          price: 90,
          variants: [
            { id: 'green-sherman-black', colorName: 'Black Waxy Leather', hexColor: '#1a1a1a', imageUrl: '/productos/green-sherman/green-sherman-black.webp', sizes: this.generateSizes() },
            { id: 'green-sherman-brown', colorName: 'Brown Waxy Leather', hexColor: '#4D3B37', imageUrl: '/productos/green-sherman/green-sherman-brown.webp', sizes: this.generateSizes() },
            { id: 'green-sherman-natural', colorName: 'Natural Waxy Leather', hexColor: '#A1866B', imageUrl: '/productos/green-sherman/green-sherman-natural.webp', sizes: this.generateSizes() },
            { id: 'green-sherman-cinder', colorName: 'Cinder Brown Waxy Suede', hexColor: '#6E5F41', imageUrl: '/productos/green-sherman/green-sherman-cinder-brown.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'green-sherman-mesa', colorName: 'Mesa Suede', hexColor: '#866D37', imageUrl: '/productos/green-sherman/green-sherman-mesa.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Yukon Ranger Boot',
          price: 90,
          variants: [
            { id: 'green-yukon-black', colorName: 'Black Waxy Leather', hexColor: '#1a1a1a', imageUrl: '/productos/green-yukon/green-yukon-black.webp', sizes: this.generateSizes() },
            { id: 'green-yukon-seahorse', colorName: 'Seahorse Waxy Leather', hexColor: '#5C4033', imageUrl: '/productos/green-yukon/green-yukon-seahorse.webp', sizes: this.generateSizes() },
            { id: 'green-yukon-grain-dark', colorName: 'Grain Dark Brown', hexColor: '#5C4033', imageUrl: '/productos/green-yukon/green-yukon-dark-brown.webp', swatchUrl: '/swatches/dark-brown.webp', sizes: this.generateSizes() },            
          ]
        },
        {
          styleName: 'Vermont Camp Lug',
          price: 80,
          variants: [
            { id: 'green-vermont-Natural', colorName: 'Natural Waxy Leather', hexColor: '#A1866B', imageUrl: '/productos/green-vermont/green-vermont-natural.webp', sizes: this.generateSizes() },
            { id: 'green-vermont-cinder', colorName: 'Cinder Brown Waxy Suede', hexColor: '#6E5F41', imageUrl: '/productos/green-vermont/green-vermont-cinder-brown.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Acadia Camp Moc',
          price: 70,
          variants: [
            { id: 'green-acadia-natural', colorName: 'Natural Waxy Leather', hexColor: '#A1866B', imageUrl: '/productos/green-acadia/green-acadia-natural.webp', sizes: this.generateSizes() },
            { id: 'green-acadia-mesa', colorName: 'Mesa Suede', hexColor: '#866D37', imageUrl: '/productos/green-acadia/green-acadia-mesa.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'PALOMO® Loafer',
          price: 70,
          variants: [
            { id: 'green-penny-black', colorName: 'Black Moc', hexColor: '#1a1a1a', imageUrl: '/productos/green-penny/green-penny-black.webp', sizes: this.generateSizes() },
            { id: 'green-penny-brown', colorName: 'Brown Moc', hexColor: '#5C4033', imageUrl: '/productos/green-penny/green-penny-brown.webp', sizes: this.generateSizes() },
            { id: 'green-penny-burgundy', colorName: 'Burgundy Moc', hexColor: '#3A2411', imageUrl: '/productos/green-penny/green-penny-burgundy.webp', sizes: this.generateSizes() },
            { id: 'green-penny-sandstone', colorName: 'Sandstone Waxy Leather', hexColor: '#95591A', imageUrl: '/productos/green-penny/green-penny-sandstone.webp', sizes: this.generateSizes()},
            { id: 'green-penny-mesa', colorName: 'Mesa Suede', hexColor: '#866D37', imageUrl: '/productos/green-penny/green-penny-mesa.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Lola Loafer Woman',
          price: 86,
          variants: [
            { id: 'green-lola-black', colorName: 'Black Moc', hexColor: '#1a1a1a', imageUrl: '/productos/green-lola/green-lola-black.webp', sizes: this.generateSizes() },
            { id: 'green-lola-burgundy', colorName: 'Burgundy Moc', hexColor: '#3A2411', imageUrl: '/productos/green-lola/green-lola-burgundy.webp', sizes: this.generateSizes() },
            { id: 'green-lola-pony', colorName: 'Pony', hexColor: '#3A2411', imageUrl: '/productos/green-lola/green-lola-pony.webp', swatchUrl: '/swatches/pony.webp', sizes: this.generateSizes()},
            { id: 'green-lola-leopard', colorName: 'Leopard', hexColor: '#3A2411', imageUrl: '/productos/green-lola/green-lola-leopard.webp', swatchUrl: '/swatches/leopard.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'green-lola-snake', colorName: 'Snake', hexColor: '#3A2411', imageUrl: '/productos/green-lola/green-lola-snake.webp', swatchUrl: '/swatches/snake.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Paloma Boat Shoe',
          price: 65,
          variants: [
            { id: 'green-paloma-green', colorName: 'Hunter Green', hexColor: '#5D5B31', imageUrl: '/productos/green-paloma/green-paloma-hunter-green.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'green-paloma-sand', colorName: 'Sand', hexColor: '#B1AC8E', imageUrl: '/productos/green-paloma/green-paloma-sand.webp', sizes: this.generateSizes() },
          ]
        },
      ]
    },
    {categoryName: 'Atlas Label',
      description: 'New collection just for you.',
      styles: [
        {
          styleName: 'Newport Boat Shoe',
          price: 119.50,
          variants: [
            { id: 'new-newport-shoe-ink-navy', colorName: 'Ink Navy', hexColor: '#323B48', imageUrl: '/productos/new-boat-shoe/new-boat-shoe-bentley-blue.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'new-newport-shoe-bourbon', colorName: 'Bourbon', hexColor: '#B2702B', imageUrl: '/productos/new-boat-shoe/new-boat-shoe-repello-autum.webp', sizes: this.generateSizes(), isSuede: true},
          ]
        },
        {
          styleName: 'Sherman Chelsea Boot',
          price: 167,
          variants: [
            { id: 'new-sherman-deser-tan', colorName: 'Desert Tan', hexColor: '#CDAE6D', imageUrl: '/productos/new-spring-sherman/new-sherman-repello-autum.webp', sizes: this.generateSizes(), isSuede: true },
          ]
        },
        {
          styleName: 'Sahara Desert Boot',
          price: 155,
          variants: [
            { id: 'new-sahara-olive', colorName: 'Olive Suede', hexColor: '#6E5F41', imageUrl: '/productos/new-sahara/new-sahara-olive.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'new-sahara-cognac', colorName: 'Cognac Suede', hexColor: '#79460E', imageUrl: '/productos/new-sahara/new-sahara-cognac.webp', sizes: this.generateSizes(), isSuede: true },
            { id: 'new-sahara-jet-black', colorName: 'Jet Black Leather', hexColor: '#1A1A1A', imageUrl: '/productos/new-sahara/new-sahara-jet-black.webp', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Ischia Mule',
          price: 95,
          variants: [
            { id: 'new-ischia-noir-leather', colorName: 'Noir Leather', hexColor: '#1a1a1a', imageUrl: '/productos/new-ischia/new-ischia-noir-leather.webp', sizes: this.generateSizes() },
            { id: 'new-ischia-tundra-suede', colorName: 'Tundra Suede', hexColor: '#887152', imageUrl: '/productos/new-ischia/new-ischia-tundra-suede.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Portofino Driving Moc',
          price: 86,
          variants: [
            { id: 'new-portofino-toasted-velour', colorName: 'Toasted Velour', hexColor: '#6B4424', imageUrl: '/productos/new-portofino/new-portofino-toasted-velour.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-portofino-fox-brown.velour', colorName: 'Fox Brown Velour', hexColor: '#4D2E21', imageUrl: '/productos/new-portofino/new-portofino-fox-brown-velour.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Tahoe Hiker Boot',
          price: 155,
          variants: [
            { id: 'new-tahoe-honey-leather', colorName: 'Honey Leather', hexColor: '#B2702B', imageUrl: '/productos/new-tahoe/new-tahoe-honey.webp', sizes: this.generateSizes() },
            { id: 'new-tahoe-caramel-glove', colorName: 'Caramel Glove', hexColor: '#4D3B37', imageUrl: '/productos/new-tahoe/new-tahoe-caramel.webp', swatchUrl: '/swatches/caramel.webp', sizes: this.generateSizes() },
            { id: 'new-tahoe-onyx-glove', colorName: 'Onyx Glove', hexColor: '#1A1A1A', imageUrl: '/productos/new-tahoe/new-tahoe-onyx.webp', sizes: this.generateSizes() },
            { id: 'new-tahoe-salt&pepper', colorName: 'Salt & Pepper Pony Hair', hexColor: '#FFFFFF', imageUrl: '/productos/new-tahoe/new-tahoe-saltpepper.webp', swatchUrl: '/swatches/salt-pepper.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-tahoe-tortoise', colorName: 'Tortoise Pony Hair', hexColor: '#B2702B', imageUrl: '/productos/new-tahoe/new-tahoe-tortoise.webp', swatchUrl: '/swatches/tortoise.webp', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Savile Loafer',
          price: 124,
          variants: [
            { id: 'new-savile-garnet-horween', colorName: 'Garnet Horween', hexColor: '#4D2E21', imageUrl: '/productos/new-savile/new-savile-garnet.webp', sizes: this.generateSizes() },
            { id: 'new-savile-noir-horween', colorName: 'Noir Horween', hexColor: '#1a1a1a', imageUrl: '/productos/new-savile/new-savile-noir-horween.webp', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Savile Loafer Cordovan Bourbon',
          price: 523.50,
          variants: [
            { id: 'new-savile-cordovan-bourbon', colorName: 'Cordovan Bourbon', hexColor: '#3A2411', imageUrl: '/productos/new-savile/new-savile-cordovan.webp', sizes: this.generateSizes() },
          ]
        },
        {
          styleName: 'Capri Loafer',
          price: 155,
          variants: [
            { id: 'new-capri-black', colorName: 'Capri Black', hexColor: '#1a1a1a', imageUrl: '/productos/new-capri/new-capri-black.webp', sizes: this.generateSizes() },
            { id: 'new-capri-cognac', colorName: 'Capri Cognac', hexColor: '#3F372E', imageUrl: '/productos/new-capri/new-capri-cognac.webp', sizes: this.generateSizes()},
          ]
        },
        {
          styleName: 'Baja Loafer',
          price: 133.50,
          variants: [
            { id: 'new-baja-terra-suede', colorName: 'Terra Suede', hexColor: '#887152', imageUrl: '/productos/new-baja/new-baja-terra-suede.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-baja-midnight-suede', colorName: 'Midnight Suede', hexColor: '#323B48', imageUrl: '/productos/new-baja/new-baja-midnight-suede.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-baja-oyster-suede', colorName: 'Oyster Suede', hexColor: '#79460E', imageUrl: '/productos/new-baja/new-baja-oyster-suede.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Antibes Loafer',
          price: 124,
          variants: [
            { id: 'new-antibes-chesnut-suede', colorName: 'Chesnut Suede', hexColor: '#887152', imageUrl: '/productos/new-antibes/new-antibes-chesnut-suede.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-antibes-stucco-velour', colorName: 'Stucco Velour', hexColor: '#B1AC8E', imageUrl: '/productos/new-antibes/new-antibes-stucco-velour.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-antibes-slate-blue', colorName: 'Slate Blue Suede', hexColor: '#323B48', imageUrl: '/productos/new-antibes/new-antibes-slate-blue.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Ibiza Loafer',
          price: 105,
          variants: [
            { id: 'new-ibiza-ivory-velour', colorName: 'Ivory Velour', hexColor: '#ECE9D6', imageUrl: '/productos/new-ibiza/new-ibiza-ivory.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ibiza-autum-gold', colorName: 'Autum Calf Gold', hexColor: '#6B4424', imageUrl: '/productos/new-ibiza/new-ibiza-autum-gold.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ibiza-slate-blue', colorName: 'Slate Blue Suede', hexColor: '#1C3240', imageUrl: '/productos/new-ibiza/new-ibiza-slate-blue.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ibiza-chestnut', colorName: 'Chestnut Suede', hexColor: '#4D2E21', imageUrl: '/productos/new-ibiza/new-ibiza-chestnut-suede.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ibiza-asparagus', colorName: 'Asparagus', hexColor: '#5D5B31', imageUrl: '/productos/new-ibiza/new-ibiza-asparagus.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Edmund Plain Toe Boot',
          price: 167,
          variants: [
            { id: 'new-edmund-fawn-suede', colorName: 'Fawn Suede', hexColor: '#ECE9D6', imageUrl: '/productos/new-spring-edmund/new-edmund-fawn-suede.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-edmund-repello-autum', colorName: 'Repello Calf Autum Gold', hexColor: '#B2702B', imageUrl: '/productos/new-spring-edmund/new-edmund-repello-autum.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Freeport Camp Moc Boot',
          price: 155,
          variants: [
            { id: 'new-freeport-suede-saddle', colorName: 'Suede Saddle', hexColor: '#6B4424', imageUrl: '/productos/new-freeport/new-freeport-saddle.webp', swatchUrl: '/swatches/saddle.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-freeport-loden-suede', colorName: 'Loden Suede', hexColor: '#B2702B', imageUrl: '/productos/new-freeport/new-freeport-loden.webp', swatchUrl: '/swatches/loden.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Stresa Sneaker',
          price: 119.50,
          variants: [
            { id: 'new-stresa-noir-leather', colorName: 'Noir Leather', hexColor: '#1a1a1a', imageUrl: '/productos/new-stresa/new-stresa-noir-leather.webp', sizes: this.generateSizes() },
            { id: 'new-stresa-autum-gold', colorName: 'Autum Calf Gold', hexColor: '#B2702B', imageUrl: '/productos/new-stresa/new-stresa-autum-gold.webp', sizes: this.generateSizes(), isSuede : true },
          ]
        },
        {
          styleName: 'Ponza Venettian',
          price: 155,
          variants: [
            { id: 'new-ponza-stucco-velour', colorName: 'Stucco Velour', hexColor: '#BF9E4F', imageUrl: '/productos/new-ponza/new-ponza-stucco-velour.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ponza-espresso-leather', colorName: 'Espresso Leather', hexColor: '#301D11', imageUrl: '/productos/new-ponza/new-ponza-espresso.webp', sizes: this.generateSizes(), isSuede : true },
            { id: 'new-ponza-noir-leather', colorName: 'Noir Leather', hexColor: '#1A1A1A', imageUrl: '/productos/new-ponza/new-ponza-noir-leather.webp', sizes: this.generateSizes() },
            { id: 'new-ponza-ink-navy-suede', colorName: 'Ink Navy Suede', hexColor: '#323B48', imageUrl: '/productos/new-ponza/new-ponza-ink-navy-suede.webp', sizes: this.generateSizes(), isSuede : true},
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

  // ---- FUNCIONES DEL CARRUSEL PEQUEÑO ----
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

  // ---- FUNCIONES DEL MODAL GIGANTE ----
  openModal(categoryName: string, style: ProductStyle, startIndex: number) {
    this.modalData = { categoryName, style, currentIndex: startIndex };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openCartModal() {
    this.isCartModalOpen = true;
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  modalNext(event: Event) {
    event.stopPropagation();
    if (this.modalData.style) {
      const len = this.modalData.style.variants.length;
      this.modalData.currentIndex = (this.modalData.currentIndex + 1) % len;
      // Sincronizar el carrusel de fondo con la imagen del modal
      const key = this.modalData.categoryName + '-' + this.modalData.style.styleName;
      this.activeVariantIndices[key] = this.modalData.currentIndex;
    }
  }

  modalPrev(event: Event) {
    event.stopPropagation();
    if (this.modalData.style) {
      const len = this.modalData.style.variants.length;
      this.modalData.currentIndex = (this.modalData.currentIndex - 1 + len) % len;
      // Sincronizar el carrusel de fondo con la imagen del modal
      const key = this.modalData.categoryName + '-' + this.modalData.style.styleName;
      this.activeVariantIndices[key] = this.modalData.currentIndex;
    }
  }
  // ----------------------------------------

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