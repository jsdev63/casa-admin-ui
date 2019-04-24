import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Role } from 'app/main/apps/roles/role.model';
import {Router} from '@angular/router';

import { RolesService } from 'app/main/apps/topic/roles.service';

@Component({
    selector     : 'roles-role-form-dialog',
    templateUrl  : './role-form.component.html',
    styleUrls    : ['./role-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RolesRoleFormDialogComponent
{    
    title:string="Topic"
    action: string | 'edit';
    role: Role;
    roleForm: FormGroup;
    dialogTitle: string;
    register: string;
    categories: any = []; 
    /**
     * Constructor
     *
     * @param {MatDialogRef<RolesRoleFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<RolesRoleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private rolesService:RolesService,
        private router:Router,
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.getCategory();
       
        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Topic';
            this.role = _data.role;
        }
        else
        {
            this.dialogTitle = 'New Topic';
            this.role = new Role({});
        }

        this.roleForm = this.createRoleForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create role form
     *
     * @returns {FormGroup}
     */
    createRoleForm(): FormGroup
    {
       return this._formBuilder.group({
           id : [this.role.id],
           name : [this.role.name, [Validators.required]],
           category: [this.role.category]
        });
    }

  
    addRole(roleForm)
    { 
     var response : any;
     this.rolesService.addRole(roleForm.value).
        subscribe(
        data => {this.matDialogRef.close();
                    this.rolesService.getRoles();}, 
            err => {
                this.register = err.error.message;
            }, 
            () => console.log('yay'));        
     }    


    updateRole(roleForm)
    {
        var response : any;
        this.rolesService.editRole(roleForm.value).subscribe (data => {
            this.matDialogRef.close();
            this.rolesService.getRoles();
        }, err => {
            this.register = err.error.message;
        },
        () => console.log('yay'));             
     }

    getCategory ()
    {
        this.rolesService.getCategory().subscribe (response => {
            this.categories = response.data;
        }, err => {
        },
        () => console.log('yay'));             
     }
             
}
