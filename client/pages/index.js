import Link from 'next/link';

// we can only use useRequest inside of a react component (can only use hooks on components)
// we use a useRequest to make it easy to make to a request and handle any errors that may occur

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // context means first arg which is 'req'

  // we get response first, and in res we get data (hence destructuring)
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
