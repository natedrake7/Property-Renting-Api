# Property-Renting-Api

This is a full stack API where users can have 2 roles.A user can be a tenant and a Host.
As a tenant a user can look at the available properties for booking and can select the dates he
wants to book the property.As A host a user can upload info as well as images for a property he wants
to be booked.

Both types of users share some similarities:
1)A user that is a host can book properties as well as list them.
2)A user can edit all of his details(e.g password,email,username,firstname etc).
3)A user can delete his account ,which in turn deletes all of his data from the server.
4)A user can download his personal data as a .JSON file.

Only Host Users:
5)A user that is a host can also view his host profile (which has some more additions from the 
  user profile,like a profile image) and edit all of his additional details.
6)A user that is a host can also view through a personal page,all of his listed properties,
  edit them,view a preview page of each property,delete them,as well as list new properties.

There was an idea for an admin page,where an admin would have access to all of the users,but it was not
implemented.

When the webpage is opened,the user is welcomed by a list of the available for rent properties,
as well as a navigation bar.

By clicking a property on the list of the available properties,the user will be redirected to the 
property preview page,where he can check all of the property's details and images,and also if he is
an authenticated user,book the property for the desired dates.

On the navigation bar,there are 3 buttons and a search bar.The search bar allows the user to search for
properties on the city,address,country etc of his choosing.The first button is a home button that redirects 
the user to the home page,and the other 2 buttons are the register and login buttons.By clicking the register
button the user is redirected to the register page,where given some credentials(username,password,first name,email
,phone number etc) he becomes an authenticated user and can now successfully book properties.He also has the option
(during registration) to become a host user as well,but he needs to share some more credentials(like a profile image).
The login button redirects the user to the login page,where by giving his username and password can login.Both pages,
after registering or logging in successfully,redirect the user to the home page where now the register and login button
are gone,and the view profile and logout buttons appear.By clicking the profile button the user is redirected to the 
user profile,whose usage is mentioned above.By clicking the logout button the user is effectively logged out.

Security Measures Implemented:
1)SSL.
2)JSON web tokens.
3)Authorization.
4)Authentication.

Minor Details:
1)The whole interaction for some private data between the client and server is done by JSON tokens.
2)The backend service used the MVC model.
3)The frontend service uses the component-service model,

Ideas that were not implemented:
1)An admin page.
2)CSRF(Cross-Site Anti-Forgery).
3)The ability for users to view their current bookings and unbook them.

Frameworks etc:
1)The server was an msSQL server,and it was hosted locally on my machine for testing.
2)The backend was done on ASP .NET Core,on .NET version 7.0.
3)The front end was done on Angular CLI 16.1.4,Node: 18.16.1,along with the boostrap framework(for HTML and CSS).

This was a fan project by me,and it was an introduction (for me) to the idea of working
with frameworks and multiple languages.This project took me around 3 months to develop,
but a lot of those 3 months was not actually on the project as I had my college exams.
This is not by any means a finished project,as it would require some more security measures
(like Cross-Site Anti-Forgery),some more web pages,a real way for users to pay,and a proper
deployment.
