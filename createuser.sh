aws cognito-idp admin-create-user \
    --user-pool-id us-west-2_aaaaaaaaa \
    --username diego@example.com \
    --user-attributes Name=email,Value=kermit2@somewhere.com Name=phone_number,Value="+15555551212" \
    --message-action SUPPRESS