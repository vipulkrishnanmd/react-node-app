#!/bin/bash
sudo yum -y update

echo "Install Java JDK 8"
sudo yum remove -y java
sudo yum install -y java-1.8.0-openjdk

#echo "Install Node"
#sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
#sudo . ~/.nvm/nvm.sh
#sudo nvm install node

echo "Install git"
yum install -y git

echo "Install Docker engine"
sudo yum update -y
sudo yum install docker -y
#sudo usermod -a -G docker jenkins
#sudo service docker start
sudo chkconfig docker on

echo "Install Jenkins"
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
sudo yum install -y jenkins
sudo usermod -a -G docker jenkins
sudo chkconfig jenkins on
sudo service docker start
sudo service jenkins start

sleep 2m

sudo echo "something" > /mnt/test
echo "${server_url}" > /mnt/server_url

curl -O http://localhost:8080/jnlpJars/jenkins-cli.jar

sudo java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:"$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)" install-plugin trilead-api  cloudbees-folder antisamy-markup-formatter jdk-tool script-security  command-launcher structs workflow-step-api token-macro bouncycastle-api build-timeout credentials plain-credentials ssh-credentials credentials-binding scm-api workflow-api timestamper workflow-support  durable-task workflow-durable-task-step junit matrix-project resource-disposer ws-cleanup ant ace-editor jquery-detached  workflow-scm-step workflow-cps workflow-job apache-httpcomponents-client-4-api display-url-api mailer workflow-basic-steps gradle pipeline-milestone-step  jackson2-api pipeline-input-step pipeline-stage-step pipeline-graph-analysis pipeline-rest-api  handlebars momentjs pipeline-stage-view pipeline-build-step pipeline-model-api pipeline-model-extensions  jsch git-client git-server  workflow-cps-global-lib branch-api workflow-multibranch authentication-tokens docker-commons docker-workflow pipeline-stage-tags-metadata pipeline-model-declarative-agent pipeline-model-definition lockable-resources workflow-aggregator github-api git github github-branch-source pipeline-github-lib mapdb-api subversion ssh-slaves matrix-auth pam-auth ldap email-ext docker-plugin docker-java-api github-pullrequest icon-shim ssh-agent kubernetes-cd

sudo java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:"$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)" restart

sleep 1m

cat > docker_credential.xml <<EOF
<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
  <scope>GLOBAL</scope>
  <id>dockerHubCredentials</id>
  <description></description>
  <username>vipulkrishnanmd</username>
  <password>${docker_password}</password>
</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
EOF

cat > server_credential.xml <<EOF
<com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey plugin="ssh-credentials">
  <scope>GLOBAL</scope>
  <id>serverKey</id>
  <description></description>
  <username>ubuntu</username>
  <privateKeySource class="com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey\$DirectEntryPrivateKeySource">
    <privateKey>${private_key}</privateKey>
  </privateKeySource>
</com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey>
EOF

sudo java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:"$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)" create-credentials-by-xml system::system::jenkins "(global)" < docker_credential.xml
sudo java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:"$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)" create-credentials-by-xml system::system::jenkins "(global)" < server_credential.xml

cat > job.xml <<EOF
<?xml version='1.1' encoding='UTF-8'?>
<org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject plugin="workflow-multibranch">
  <actions/>
  <description></description>
  <properties>
    <org.jenkinsci.plugins.docker.workflow.declarative.FolderConfig plugin="docker-workflow">
      <dockerLabel></dockerLabel>
      <registry plugin="docker-commons"/>
    </org.jenkinsci.plugins.docker.workflow.declarative.FolderConfig>
  </properties>
  <folderViews class="jenkins.branch.MultiBranchProjectViewHolder" plugin="branch-api">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </folderViews>
  <healthMetrics>
    <com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric plugin="cloudbees-folder">
      <nonRecursive>false</nonRecursive>
    </com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric>
  </healthMetrics>
  <icon class="jenkins.branch.MetadataActionFolderIcon" plugin="branch-api">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </icon>
  <orphanedItemStrategy class="com.cloudbees.hudson.plugins.folder.computed.DefaultOrphanedItemStrategy" plugin="cloudbees-folder">
    <pruneDeadBranches>true</pruneDeadBranches>
    <daysToKeep>-1</daysToKeep>
    <numToKeep>-1</numToKeep>
  </orphanedItemStrategy>
  <triggers/>
  <disabled>false</disabled>
  <sources class="jenkins.branch.MultiBranchProject\$BranchSourceList" plugin="branch-api">
    <data>
      <jenkins.branch.BranchSource>
        <source class="org.jenkinsci.plugins.github_branch_source.GitHubSCMSource" plugin="github-branch-source">
          <id>3f1cb5fe-28a1-4a37-8ffa-11a706f6c197</id>
          <apiUri>https://api.github.com</apiUri>
          <repoOwner>vipulkrishnanmd</repoOwner>
          <repository>single-command-web-infra-setup</repository>
          <repositoryUrl>https://github.com/vipulkrishnanmd/single-command-web-infra-setup.git</repositoryUrl>
          <traits>
            <org.jenkinsci.plugins.github__branch__source.BranchDiscoveryTrait>
              <strategyId>1</strategyId>
            </org.jenkinsci.plugins.github__branch__source.BranchDiscoveryTrait>
            <org.jenkinsci.plugins.github__branch__source.OriginPullRequestDiscoveryTrait>
              <strategyId>1</strategyId>
            </org.jenkinsci.plugins.github__branch__source.OriginPullRequestDiscoveryTrait>
            <org.jenkinsci.plugins.github__branch__source.ForkPullRequestDiscoveryTrait>
              <strategyId>1</strategyId>
              <trust class="org.jenkinsci.plugins.github_branch_source.ForkPullRequestDiscoveryTrait\$TrustPermission"/>
            </org.jenkinsci.plugins.github__branch__source.ForkPullRequestDiscoveryTrait>
          </traits>
        </source>
        <strategy class="jenkins.branch.DefaultBranchPropertyStrategy">
          <properties class="empty-list"/>
        </strategy>
      </jenkins.branch.BranchSource>
    </data>
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </sources>
  <factory class="org.jenkinsci.plugins.workflow.multibranch.WorkflowBranchProjectFactory">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
    <scriptPath>Jenkinsfile</scriptPath>
  </factory>
</org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject>
EOF

sudo java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:"$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword)" create-job myapp < job.xml
