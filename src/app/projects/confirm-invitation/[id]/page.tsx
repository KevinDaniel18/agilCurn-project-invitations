"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// Define types for your API response
interface Project {
  id: number;
  projectName: string;
  // Add other project fields as needed
  userRoles: {
    id: number;
    userId: number;
    projectId: number;
    roleId: number;
    user: {
      id: number;
      fullname: string;
      email: string;
      // Other user fields
    };
    role: {
      id: number;
      roleName: string;
      description: string;
    };
  }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ConfirmInvitationPage = () => {
  const { id, roleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Only run the confirmation when the id and roleId are available from the URL
    if (id && roleId) {
      confirmInvitation();
    } else if (id) {
      // If roleId is missing, we'll pass a default (Developer = 3)
      confirmInvitation(3);
    }
  }, [id, roleId]);

  const confirmInvitation = async (defaultRoleId?: number) => {
    try {
      setLoading(true);

      const roleIdToUse = roleId || defaultRoleId;
      const response = await axios.get(
        `${API_URL}/projects/confirm-invitation/${id}?roleId=${roleIdToUse}`
      );
      setProject(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        "Failed to confirm invitation. The invitation may have already been confirmed or does not exist."
      );
      setLoading(false);
      console.error("Error confirming invitation:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Confirming your invitation...
          </h1>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Invitation Confirmed!</h1>
          <div className="text-left">
            <h2 className="text-2xl font-semibold mb-2">
              Project: {project.projectName}
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-2">Team Members:</h3>
            <ul className="space-y-4">
              {project.userRoles.map((userRole) => (
                <li key={userRole.id} className="p-3 border rounded-lg">
                  <div className="font-semibold">{userRole.user.fullname}</div>
                  <div className="text-sm text-blue-600">
                    {userRole.role.roleName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userRole.user.email}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfirmInvitationPage;
