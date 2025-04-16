
import React, { useState } from 'react';
import { commonMedications } from '@/lib/data/medications';

export default function MedicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMedications = searchQuery.length > 0 
    ? commonMedications.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (med.genericName && med.genericName.toLowerCase().includes(searchQuery.toLowerCase())))
    : commonMedications;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Medications</h1>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search medications..."
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedications.map((medication) => (
          <div key={medication.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="font-semibold text-lg text-primary">{medication.name}</h3>
            {medication.genericName && (
              <p className="text-sm text-gray-500 mb-2">{medication.genericName}</p>
            )}
            <div className="mt-3">
              <p className="text-sm font-medium">Common dosages:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {medication.commonDosages.map((dosage) => (
                  <span key={dosage} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {dosage}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">Typical frequency:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {medication.commonFrequencies.map((frequency) => (
                  <span key={frequency} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">
                    {frequency}
                  </span>
                ))}
              </div>
            </div>
            {medication.category && (
              <p className="mt-3 text-xs text-gray-500">Category: {medication.category}</p>
            )}
          </div>
        ))}
      </div>

      {filteredMedications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No medications found matching your search.</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Add New Medication
        </button>
      </div>
    </div>
  );
}
