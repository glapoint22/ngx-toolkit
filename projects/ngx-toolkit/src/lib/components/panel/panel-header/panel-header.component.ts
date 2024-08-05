import { Component, contentChild } from '@angular/core';
import { PanelHeaderTitleComponent } from '../panel-header-title/panel-header-title.component';
import { PanelHeaderActionsComponent } from '../panel-header-actions/panel-header-actions.component';

@Component({
  selector: 'panel-header',
  standalone: true,
  imports: [],
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.scss'
})
export class PanelHeaderComponent {
  protected title = contentChild(PanelHeaderTitleComponent);
  protected actions = contentChild(PanelHeaderActionsComponent);
}