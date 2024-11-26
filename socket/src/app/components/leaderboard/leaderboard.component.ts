import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { SocketService } from '../../services/socket.service'; // Asegúrate de importar el servicio
import { first, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  imports: [CommonModule],
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  leaderboard: { name: string; score: number }[] | undefined;
  private leaderboardSubscription!: Subscription;

  constructor(
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    // Conectar al socket cuando el componente se inicie
    // this.socketService.connect();

    this.appRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.socketService.connect();
    })

    // Escuchar el evento de actualización del leaderboard
    this.socketService.on('leaderboard-update', (data) => {
      // Solo actualizar si los datos son diferentes
      if (JSON.stringify(this.leaderboard) !== JSON.stringify(data)) {
        this.leaderboard = data; // Actualiza el leaderboard con los nuevos datos
        console.log(this.leaderboard);
        this.cdRef.detectChanges(); // Forzar la actualización de cambios
      }
    });
  }

  ngOnDestroy(): void {
    // Dejar de escuchar el evento cuando el componente se destruya
    this.socketService.off('leaderboard-update');
    this.socketService.disconnect();
  }
}
