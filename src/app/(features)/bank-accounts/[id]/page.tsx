'use client';

import { useParams } from "next/navigation";
import NewBankAccountTypeComponent from "../_component/new-bank-account-component";

export default function NewBankAccountTypePage() {
    const params = useParams();

    return (
        <NewBankAccountTypeComponent editMode={params?.id==='new' ?'new':'detail'} />
    );
}