import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Session } from '../../../core/models/session.model';
import { Demande } from '../../../core/models/demande.model';
import { FormGroup, FormControl } from '@angular/forms';
import { SessionService } from '../../../core/services/session/session.service';
import { OrganizationService } from '../../../core/services/organization/organization.service';
import { SaveOrUpdateComponent } from '../save-or-update/save-or-update.component';
import { DetailComponent } from '../detail/detail.component';
import { TokenStorageService } from '../../../core/services/token_storage/token-storage.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ["name", "action"];

  dataSource: MatTableDataSource<Session>;
  demandeSession: Demande <Session> = new Demande<Session>();

  session: Session = new Session();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  resultsLength;

  listOrganization: any;

  sessionForm = new FormGroup({
    name: new FormControl(""),
    organization: new FormControl()
  });
  constructor(
    private sessionService: SessionService,
    private dialog: MatDialog,
    private tokenStorageService:TokenStorageService,
    private translateService:TranslateService
  ) {}
  ngOnInit() {
    const user = this.tokenStorageService.getUser();
    this.sessionForm.get("organization").setValue(user.organization);
   this.search(false);
  }

  search(bool) {
    if (!bool) {
      this.initPagination();
    }
    const page = this.paginator.pageIndex;
    const size = this.paginator.pageSize;
    const name = this.sessionForm.get("name").value;
    const organization = this.sessionForm.get("organization").value;
    console.log("organization", organization);
    this.session.name = name;
    this.session.organization = organization;
    this.demandeSession.model = this.session;
    this.demandeSession.page = page;
    this.demandeSession.size = size;
    this.searchByCritere(this.demandeSession);
  }

  searchByCritere(demande: Demande<Session>) {
    console.log("demande", demande);
    this.sessionService.searchByCritere(demande).subscribe((resp: any) => {
      console.log("sessions from database afak ---------------", resp);
      this.resultsLength = resp.count;
      this.dataSource = new MatTableDataSource<Session>(resp.lignes);
      this.paginator.pageIndex = demande.page;
    });
  }
  initPagination() {
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
  }
  reset() {
    this.sessionForm.get("name").setValue("");
    this.search(false);
  }
  refreshDataTable() {
    console.log("this.paginator", this.paginator);

    this.search(true);
  }

  openDialog(data) {
    console.log("data", data);
    const dialogRef = this.dialog.open(SaveOrUpdateComponent, {
      width: "80%",
      data: data,
      disableClose: true,
      autoFocus: false,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.search(false);
      }
      
      console.log("The dialog was closed");
    });
  }
  openDialogDetail(row){
    const dialogRef = this.dialog.open(DetailComponent, {
      width: "60%",
      data: row,
      disableClose: true

    });

    dialogRef.afterClosed().subscribe(result => {
     console.log('result mn dialog detail afakom rkzo m3ana   -----------',result);
  
    });
  }
  
  delete(row) {
    this.sessionService.delete(row.id).subscribe(
      response => {
        console.log("response", response);
        this.search(true);
      },
      error => {
        console.log("error", error);
      }
    );
  }
  openDialogDelete(module) {
    let actionDeleted=this.getI18n("ACTION.DELETED");
    let userDeleted= this.getI18n("SESSION.DELETED");
    swal({
      title: this.getI18n("SESSION.DELETE"),
      text: this.getI18n("ACTION.CONFIRMATION_MESSAGE"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.getI18n("ACTION.CONFIRMATION"),
      cancelButtonText: this.getI18n("ACTION.CANCEL_CONFIRMATION"),
      reverseButtons: false,
      focusCancel: true,
    })
      .then(() => this.delete(module))
      .then(function () {
        swal({
          title: actionDeleted,
          text:userDeleted,
          type: "success",
        });
      })
      .catch();
  }
  getI18n(name): string {
    let i18;
    this.translateService.get(name).subscribe((value: string) => {
      i18 = value;
    });
    return i18;
  }
 

}
