import axios from 'axios';

import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  // We can optionally put in additional properties to include in the request body
  // so if we put in a property, it will be merged with the request body

  const doRequest = async (props = {}) => {
    try {
      // to reset errors object, whenever the hook is used
      setErrors(null);

      // method is the http response type (get, post), this will only happen if user input details are correct
      const response = await axios[method](url, { ...body, ...props });

      // after the method has been called, we will check to see if the onSuccess callback was provided, mainly for moving to other pages
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
