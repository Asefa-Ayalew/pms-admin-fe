'use client';

import { useParams } from "next/navigation";
import NewMyOrganizationTypeComponent from "../_component/new-my-organization-component";

export default function NewMyOrganizationTypePage() {
    const params = useParams();

    return (
        <NewMyOrganizationTypeComponent editMode={params?.id==='new' ?'new':'detail'} />
    );
}