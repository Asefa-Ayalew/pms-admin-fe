'use client';

import { useParams } from "next/navigation";
import NewDepartmentTypeComponent from "../_component/new-department-component";

export default function NewDepartmentTypePage() {
    const params = useParams();

    return (
        <NewDepartmentTypeComponent editMode={params?.id==='new' ?'new':'detail'} />
    );
}