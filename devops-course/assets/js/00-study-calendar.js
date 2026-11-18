(function(){
  var START = new Date(2026, 9, 12), DAYMS = 864e5;
  var PH = [[0,"Name what you already do",1,2],[1,"The machine underneath",3,6],[2,"Containers, properly",7,10],[3,"AWS, mechanism first",11,14],[4,"Terraform, through Ansible",15,17],[5,"Kubernetes",18,21],[6,"Operating it",22,24]];
  var WK = {1:{l:"Lesson 0.1, artifact promotion: check taken early (3 of 5), re-read the gaps",b:"Interchange already scaffolded"},2:{l:"Lessons 0.3 to 0.5: secrets and OIDC, Ansible, Python",b:"OIDC so the workflow holds no key; path filters so one service rebuilds, not four"},3:{l:"Processes and file descriptors: why df and du disagree, lsof +L1, log rotation done wrong",b:"reference as plain Spring Boot on one Linux box"},4:{l:"Memory: RSS against page cache, why free looks alarming, the OOM killer and cgroups",b:"status-api and Postgres on the same box"},5:{l:"systemd units and timers, journald",b:"Run everything as systemd units, not cron"},6:{l:"Networking: 0.0.0.0 against loopback, ss, DNS and the five-second timeout, TLS handshakes",b:"Bind addresses, name resolution and TLS in front of status-api"},7:{l:"Layers and copy-on-write",b:"Dockerfiles for the Maven services, 700 MB down to 200 MB"},8:{l:"Container networking: bridge, published ports, DNS between containers",b:"All four services in containers"},9:{l:"Registries and image provenance: JFrog again, a layer down",b:"The whole system up with one Compose file"},10:{l:"Partial failure: one thing down while another is up",b:"Camel routes doing real work between the services"},11:{l:"IAM: principals, how a request is evaluated, explicit deny, SCPs and permissions boundaries",b:"AWS Budgets alarm at $20 on day one"},12:{l:"Roles against users, instance profiles, IMDS and IMDSv2: where credentials come from",b:"An EC2 box that gets credentials with no key on disk"},13:{l:"VPC: route tables make a subnet public, IGW against NAT, endpoints, SGs against NACLs",b:"VPC, subnets, security groups, RDS and SQS, clicked together on purpose"},14:{l:"S3, KMS and envelope encryption under Parameter Store",b:"Secrets Manager and ECR"},15:{l:"What is in state",b:"Start rebuilding phase 3 in Terraform, with remote state"},16:{l:"A half-failed apply has no rollback",b:"Import the resource you forgot to delete"},17:{l:"Modules, variables, outputs, and where Terraform stops and Ansible starts",b:"Per-environment modules, Terratest on one"},18:{l:"Pods, deployments, services, ingress, and what the control loop is doing",b:"The phase 2 containers on kind"},19:{l:"The debugging loop: CrashLoopBackOff, describe before logs, exit codes",b:"Resource limits on every service"},20:{l:"Probes and rolling updates: the thirty seconds where readiness passes and users get 502s",b:"Probes and ConfigMaps; rollout drills"},21:{l:"EKS: IRSA and Pod Identity, the ALB controller, node groups against Fargate, EBS CSI",b:"EKS from your own Terraform"},22:{l:"Metrics, logs and traces: which answers which question",b:"Prometheus and Grafana, Actuator metrics, RED dashboards"},23:{l:"SLOs, SLIs, error budgets: 99.9% is 43 minutes a month",b:"An availability SLO on status-api with a real error budget"},24:{l:"The dead man's switch: alerting on the absence of success",b:"All eight postmortems written up"}};
  var t = new Date(); t = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  var days = Math.round((t - START) / DAYMS);
  var week = Math.floor(days / 7) + 1;
  function iso(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
  function phase(n){ for (var i = 0; i < PH.length; i++) if (n >= PH[i][2] && n <= PH[i][3]) return PH[i]; return null; }
  function plural(n, w){ return n + ' ' + w + (n === 1 ? '' : 's'); }
  var now = document.getElementById('now'), big = document.getElementById('now-big'),
      head = document.getElementById('now-head'), body = document.getElementById('now-body'),
      link = document.getElementById('now-link');
  document.querySelectorAll('[data-week]').forEach(function(el){
    var n = +el.getAttribute('data-week');
    if (n < week) el.classList.add('past');
    if (n === week) el.classList.add('here');
  });
  var cell = document.querySelector('td[data-date="' + iso(t) + '"]');
  if (cell) cell.classList.add('today');
  if (days < 0) {
    var left = -days;
    big.innerHTML = left + '<small>' + (left === 1 ? 'day' : 'days') + ' to go</small>';
    head.textContent = 'Week 1 starts Monday 12 October';
    body.textContent = 'Phase 0, Name what you already do. Lesson 0.1, Build Once, Deploy Many (already started), then 0.2, Jenkins to GitHub Actions.';
    now.className = 'now p0'; link.href = '#w1'; link.textContent = 'Jump to week 1';
  } else if (week > 24) {
    big.innerHTML = '24<small>of 24 weeks</small>';
    head.textContent = 'The 24 weeks are over';
    body.textContent = 'The plan finished on 28 March 2027. Anything left over goes into the four-week extension the plan allows for.';
  } else {
    var p = phase(week), dayOf = days % 7 + 1, toNext = p[3] - week;
    big.innerHTML = week + '<small>of 24 · day ' + dayOf + ' of 7</small>';
    head.textContent = 'Phase ' + p[0] + ': ' + p[1];
    body.textContent = 'This week: ' + WK[week].l + '. Build: ' + WK[week].b + '. ' +
      (toNext === 0 ? 'Last week of the phase.' : plural(toNext, 'week') + ' left in this phase after this one.');
    now.className = 'now p' + p[0]; link.href = '#w' + week; link.textContent = 'Jump to week ' + week;
  }
})();
