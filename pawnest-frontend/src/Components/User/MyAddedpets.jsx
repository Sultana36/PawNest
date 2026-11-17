import { useEffect, useState, useContext } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { useNavigate } from 'react-router';
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const MyAddedPets = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_URL}/pet-list-email?email=${user.email}`)
        .then(res => setPets(res.data))
        .catch(err => console.error(err));
    }
  }, [user?.email]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove Listing?",
      text: "This listing will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      background: "#f5ebdd",
      confirmButtonColor: "#b5523b",
      cancelButtonColor: "#6f4e37",
      confirmButtonText: "Yes, delete it"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/pet-list/${id}`);
        setPets(pets.filter(pet => pet._id !== id));
        Swal.fire({title: "Deleted!", icon: "success", background: "#f5ebdd", color: "#2b1b14"});
      } catch (err) { console.error(err); }
    }
  };

  const columns = [
    { 
      id: 'serial',
      header: '#', 
      cell: info => <span className="text-base font-bold text-coffee">{info.row.index + 1}</span> 
    },
    {
      id: 'details',
      header: 'PET DETAILS',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border border-white shrink-0">
             <PhotoFrame src={info.row.original.image} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-espresso leading-tight">{info.row.original.name}</span>
            <span className="text-[10px] font-bold text-coffee/70 uppercase tracking-widest">{info.row.original.category}</span>
          </div>
        </div>
      )
    },
    {
      id: 'approval',
      header: 'APPROVAL',
      accessorKey: 'approve',
      cell: info => (
        <div>
          <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${info.getValue() === 'Accepted' ? 'bg-success text-white' : 'bg-coffee/10 text-coffee'}`}>
            {info.getValue() || 'Pending'}
          </span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: info => (
        <div className="flex gap-2 items-center">
          <button onClick={() => navigate(`/dashboard/updatepet/${info.row.original._id}`)} className="p-2 rounded-lg bg-coffee text-white hover:bg-espresso transition shadow-md" aria-label="Edit pet"><FiEdit size={16} /></button>
          <button onClick={() => handleDelete(info.row.original._id)} className="p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition shadow-sm" aria-label="Delete pet"><FiTrash2 size={16} /></button>
        </div>
      )
    }
  ];

  const table = useReactTable({ data: pets, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="font-display text-3xl font-medium text-espresso">My Added Pets</h1>
      <div className="glass-light border border-espresso/10 rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-espresso border-collapse table-fixed">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-espresso/10">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className={`py-4 px-6 text-coffee font-bold text-sm uppercase tracking-wider ${
                      header.id === 'serial' ? 'w-16 px-4 text-center' : 'w-1/3'
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-white/40 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={`py-3 px-6 ${cell.column.id === 'serial' ? 'px-4 text-center' : ''}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {pets.length === 0 && <p className="py-16 text-center text-espresso/40 font-display text-xl italic">No pets added yet.</p>}
      </div>
    </div>
  );
};

export default MyAddedPets;