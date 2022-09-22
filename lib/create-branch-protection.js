moduleexports  createBranchProtection

async function createBranchProtectionoctokit  owner repo
 HEAD
  await octokitrequest
    PUT /repos/owner/repo/branches/branch/protection
    
      mediaType
        previews luke-cage
      
      owner
      repo
      branch main
      enforce_admins null
      required_pull_request_reviews
        dismiss_stale_reviews true
      
      required_status_checks
        strict false
        contexts WIP test
      
      restrictions null
    
  

  await octokitrequestPUT /repos/owner/repo/branches/branch/protection
    mediaType
      previews luke-cage
    
    owner
    repo
    branch main
    enforce_admins null
    required_pull_request_reviews
      dismiss_stale_reviews true
    
    required_status_checks
      strict false
      contexts WIP Pika CI test 14 test 12 test 10
    
    restrictions null
  
 origin/replace-master-with-main

