import { Component } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-change-avatar',
  standalone: false,
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {
  imageChangedEvent: any = '';
  croppedImage: string = '';

  constructor(private http: HttpClient) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
  }

  upload() {
    if (!this.croppedImage) return;

    const blob = this.base64ToBlob(this.croppedImage);
    const formData = new FormData();
    formData.append('file', blob, 'avatar.png');

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('https://localhost:7001/api/Profile/upload-avatar', formData, { headers }).subscribe({
      next: () => alert('Аватар обновлён'),
      error: () => alert('Ошибка при загрузке')
    });
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }
    return new Blob([array], { type: 'image/png' });
  }
}
