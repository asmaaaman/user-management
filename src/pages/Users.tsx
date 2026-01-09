import ManagementTable from "../components/ManagementTable";
import { useUsers } from "../queries/useUsers";

const Users = () => {
  const { data: users, isLoading, isError } = useUsers();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <>
      {users && users.length > 0 ? (
        <ManagementTable users={users} />
      ) : (
        <p>No users found.</p>
      )}
    </>
  );
};

export default Users;
