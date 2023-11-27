namespace :dependencies do
  desc 'Install library dependencies'
  task :install do
    sh 'pnpm install'
  end
end

namespace :formatting do
  task :check => [:'dependencies:install'] do
    sh "pnpm formatting:check"
  end

  task :fix => [:'dependencies:install'] do
    sh "pnpm formatting:fix"
  end
end

task :lint => [:'dependencies:install'] do
  sh "pnpm lint"
end

task :check => [:'dependencies:install'] do
  sh "pnpm check"
end

task :test => [:'dependencies:install'] do
  sh "pnpm test"
end

task :build => [:'dependencies:install'] do
  sh "pnpm build"
end

namespace :version do
  task :bump, [:type] => [:'dependencies:install'] do |_, args|
    sh "npm run version:bump:#{args.type}" \
         '&& export LAST_MESSAGE="$(git log -1 --pretty=%B)" ' \
         '&& git commit -a --amend -m "${LAST_MESSAGE} [skip ci]"'
  end
end

task :default => [:'formatting:fix', :lint, :test]
