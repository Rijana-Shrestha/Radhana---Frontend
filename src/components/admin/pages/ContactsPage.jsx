import React, { useState, useMemo, useContext, useEffect } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import { Trash2, MessageSquare, Mail, Phone, MapPin } from 'lucide-react'

const ContactsPage = () => {
  const { getAllContacts, updateContactStatus, deleteContact } = useContext(AdminContext)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)

  // Fetch contacts on component mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true)
        const data = await getAllContacts()
        if (data && Array.isArray(data)) {
          setContacts(data)
          setError(null)
        } else {
          setError('Invalid contacts data format')
        }
      } catch (err) {
        setError('Failed to fetch contacts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadContacts()
  }, [getAllContacts])

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      
      const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [contacts, searchTerm, filterStatus])

  // Handle update status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus)
      const updatedContacts = await getAllContacts()
      setContacts(updatedContacts)
      setSelectedContact(null)
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id)
        const updatedContacts = await getAllContacts()
        setContacts(updatedContacts)
        setSelectedContact(null)
      } catch (err) {
        alert('Failed to delete contact: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  // Calculate statistics
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    reviewed: contacts.filter(c => c.status === 'reviewed').length,
    responded: contacts.filter(c => c.status === 'responded').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Messages</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">New</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Reviewed</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.reviewed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Responded</p>
          <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          Loading contacts...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="responded">Responded</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredContacts.length}</span> of <span className="font-semibold">{contacts.length}</span> messages
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <tr key={contact._id || contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{contact.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {contact.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">No messages found</p>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedContact.phone || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="font-medium">{selectedContact.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <p className="bg-gray-50 p-3 rounded-lg text-gray-700">{selectedContact.message}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Status</p>
                <select
                  value={selectedContact.status || 'new'}
                  onChange={(e) => handleUpdateStatus(selectedContact._id || selectedContact.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedContact._id || selectedContact.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsPage
