'use client';

import { useParams } from "next/navigation";
import NewOrganizationBankAccountTypeComponent from "../_component/new-organization-bank-account-component";

export default function NewOrganizationBankAccountTypePage() {
    const params = useParams();

    return (
        <NewOrganizationBankAccountTypeComponent editMode={params?.id==='new' ?'new':'detail'} />
    );
}