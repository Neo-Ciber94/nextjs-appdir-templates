/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/lib/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    image_url: string;
  };
  type DatabaseSessionAttributes = {};
}
