import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Organization } from '../../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  url = environment.baseUrl + "/organization";
  constructor(private httpClient: HttpClient) {}

  findAll() {
    return this.httpClient.get(this.url + "/find-all");
  }
  saveOrUpdate(organization: Organization) {
    return this.httpClient.post(this.url + "/save-or-update", organization);
  }
  searchByCritere(demande) {
    console.log("demande", demande);
    return this.httpClient.post(this.url + "/find-by-critere", demande);
  }
  delete(id) {
    return this.httpClient.delete(this.url + "/delete/" + id);
  }
  findById(id){
    return this.httpClient.get(this.url+"/find-by-id/"+id);
  }

}
