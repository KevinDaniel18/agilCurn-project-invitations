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

const ConfirmInvitationPage = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id && params?.roleId) {
      setId(params.id as string);
      setRoleId(params.roleId as string);
    }
  }, [params]);

  const confirmInvitation = async () => {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("url", apiUrl);
      console.log("id", id);
      console.log("roleId", roleId);

      const response = await axios.get(
        `${apiUrl}/projects/confirm-invitation/${Number(id)}/${Number(roleId)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Response tipo", typeof response.data);
      console.log("Contenido:", response.data);

      if (typeof response.data !== "object") {
        throw new Error("Unexpected response type");
      }

      setProject(response.data);
      console.log("Respuesta del servidor:", response.data);

      setLoading(false);
    } catch (err) {
      setError(
        "Failed to confirm invitation. The invitation may have already been confirmed or does not exist."
      );
      setLoading(false);
      console.error("Error confirming invitation:", err);
    }
  };

  useEffect(() => {
    if (id && roleId) {
      confirmInvitation();
    }
  }, [id, roleId]);

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

          <a
            href="agilcurn://home"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Open in Mobile App
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfirmInvitationPage;
