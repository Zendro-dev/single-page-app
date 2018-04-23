<template>
  <div class="col-sm-7 col-sm-offset-7">
    <h2>Welcome to Reconstruct-DB</h2>
    <p>
      This page provides documentation and help to the usage of
      Reconstruct-DB.
    </p>
    <p>
      <h3>Data Models</h3>
      <p>
        Click on the image below for a PDF version of the data models.
      </p>
      <a href="/static/reconstruct_db_schema.pdf">
        <img
          src="/static/reconstruct_db_schema.PNG"
          class="img-fluid"
          alt="Reconstruct-DB Data Models"
        />
      </a>
    </p>
    <p> 
      <h3>How to access Reconstruct-DB from your analyses scripts?</h3>
      <p>
        A <em>complete manual of the implemented API</em> can be downloaded
        <a href="/static/reconstruct_db_api.pdf">here</a>.
				The following is an example in R, of how to login and load all
				available data of model <code>sample</code>.
      </p>
      <pre>
        <code>
# Load dependencies
require(httr)

# Login
auth.token <- content(POST(
  'http://vmd17974.contabo.host:3000/login',
  body = list('email' = 'your.email@uni-institute.edu',
    'password' = 'your.password')))$token

# Obtain JSON data as list of lists
samples.list <- content(GET(
  'http://vmd17974.contabo.host:3000/samples',
  add_headers('authorization' =
    paste('bearer', auth.token)
)))
        </code>
      </pre>
    </p>
  </div>
</template>
  
<script>
export default {
}
</script>
