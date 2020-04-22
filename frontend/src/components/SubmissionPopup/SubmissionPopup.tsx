import React, { useRef, MutableRefObject, useState, useEffect } from 'react';
import { Submission } from '../../util/interfaces';
import { useOutsideClick } from '../../util/hooks';
import { PopupNote } from './PopupNote';
import { PopupUser } from './PopupUser';
import { API_URL } from '../../util/api';

interface Props {
  submissionId: number;
  formId: string;
  onClose: () => void;
  onRemove: () => void;
}

export const SubmissionPopup = ({ submissionId, formId, onClose, onRemove }: Props) => {
  const capitalize = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const [submission, setSubmission] = useState<Submission>();

  useEffect(() => {
    async function fetchSubmission() {
      const data = await fetch(`${API_URL}/${formId}/${submissionId}`, { credentials: 'include' }).then(res => res.json());

      setSubmission(data);
    }

    fetchSubmission();
  }, []);

  const popupRef = useRef();

  useOutsideClick(popupRef, () => onClose());

  async function deleteSubmission() {
    await fetch(`${API_URL}/${submission!.form.id}/submissions`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissions: [submission!.id] }),
      credentials: 'include',
    });

    onRemove();
  }

  async function markAsSpam() {
    const data = await fetch(`${API_URL}/${submission!.form.id}/${submission!.id}/spam`, { method: 'PUT', credentials: 'include' }).then(res => res.text());

    if (data == 'spam_removed') {
      return setSubmission({ ...submission!, spam: false });
    }

    return setSubmission({ ...submission!, spam: true });
  }

  return (
    <div className="fixed top-0 inset-x-0 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50" style={{ height: '90vh' }}>
      {submission && (
        <div
          className="relative bg-white rounded-lg px-8 pt-5 pb-4 overflow-hidden shadow-2xl transform transition-all w-full h-full mt-2 md:mt-14 md:w-2/5"
          ref={popupRef as any}
        >
          <div className="flex flex-row">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-7 h-7 text-gray-700">
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </svg>

            <h3 className="text-lg leading-6 font-medium text-gray-900 font-semibold my-auto ml-2">
              View Submission <span className="text-xs my-auto">Id #{submission.id}</span>
            </h3>
            {submission.spam && (
              <span className="text-red-500 ml-2 flex flex-row my-auto">
                <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 my-auto">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="align-middle text-sm my-auto"> Marked as spam</span>
              </span>
            )}
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150 absolute top-2 right-2"
              onClick={() => onClose()}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-2/3">
              <div className="flex flex-row mt-5">
                <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-gray-700">
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
                    clipRule="evenodd"
                  ></path>
                </svg>

                <h3 className="text-lg leading-6 font-medium text-gray-900 ml-2">Data</h3>
              </div>

              <div className="sm:ml-7">
                <table className="mt-1 rounded-md w-full">
                  <tbody className="rounded-md">
                    {Object.keys(JSON.parse(submission.data)).map(key => (
                      <tr>
                        <td className="text-gray-600 pr-5 pr-3 py-3 ">{capitalize(key)} </td>
                        <td className="break-all px-3">{JSON.parse(submission.data)[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PopupUser submission={submission} />
              <PopupNote submission={submission} />

              <div className="flex flex-row mt-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-700"
                >
                  <path d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>

                <h3 className="text-lg leading-6 font-medium text-gray-900 ml-2">Info</h3>
              </div>
            </div>
            <div style={{ width: '30%' }}>
              <div className="flex flex-col">
                <span className="ml-3 shadow-sm rounded-md">
                  <button
                    type="button"
                    onClick={() => markAsSpam()}
                    className="mb-2 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="-ml-1 mr-1 h-5 w-5">
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {submission.spam ? 'Unmark as spam' : 'Mark as spam'}
                  </button>
                </span>

                <span className="ml-3 shadow-sm rounded-md">
                  <button
                    type="button"
                    className="mb-2 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="-ml-1 mr-2 h-5 w-5">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Archive
                  </button>
                </span>

                <span className="ml-3 shadow-sm rounded-md">
                  <button
                    type="button"
                    onClick={() => deleteSubmission()}
                    className="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:shadow-outline-red focus:border-red-600 transition duration-150 ease-in-out"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="-ml-1 mr-2 h-5 w-5">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Delete
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};