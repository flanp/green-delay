import { User } from 'src/app/features/user/user.model';
import { UserContextService } from 'src/app/core/services/user-context.service';
import { Directive, ElementRef, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {

  @Input()
  set appHasRole(val: string[]) {
    this.roles = val;
    this.updateView();
  }

  private currentUser: User;
  private roles: string[];

  constructor(
    private elementRef: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private userContextService: UserContextService) {}

  ngOnInit() {
    this.userContextService.user$.subscribe(user => {
      this.currentUser = user;
      this.updateView();
    });
  }

  private updateView() {
    if (this.checkRole()) {
      console.log('appending');
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      console.log('clearing');
      this.viewContainerRef.clear();
    }
  }

  private checkRole() {
    return this.roles.includes('ALL')
      || (this.currentUser && this.currentUser.role && this.roles.includes(this.currentUser.role));
  }
}
