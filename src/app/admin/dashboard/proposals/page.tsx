'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Proposal {
  id: string;
  business_name: string;
  title: string;
  status: string;
  created_at: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/admin/proposals');
      const data = await response.json();
      if (data.proposals) {
        setProposals(data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Proposals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your business proposals</p>
        </div>
        <Link 
          href="/admin/dashboard/proposals/create"
          className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          New Proposal
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {proposals.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0117 7.414V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Proposals Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first proposal to send to clients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111827]">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{proposal.business_name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {proposal.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/dashboard/proposals/${proposal.id}`} 
                          className="text-gray-500 hover:text-[#10B981] dark:text-gray-400 dark:hover:text-[#10B981] transition-colors p-1"
                          title="View Brochure"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <Link 
                          href={`/admin/dashboard/proposals/edit/${proposal.id}`}
                          className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors p-1"
                          title="Edit Proposal"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this proposal?')) {
                              try {
                                const res = await fetch(`/api/admin/proposals/${proposal.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  fetchProposals();
                                } else {
                                  alert('Failed to delete proposal');
                                }
                              } catch (e) {
                                alert('Error deleting proposal');
                              }
                            }
                          }}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1"
                          title="Delete Proposal"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
