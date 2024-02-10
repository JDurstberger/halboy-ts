require 'json'
require 'open3'

module Command
  class << self
    def run(command, environment = {})
      out, status = Open3.capture2e(environment.transform_keys(&:to_s), command)
      unless status.success?
        raise("Failed to run:\n #{command}")
      end
      out
    end
  end
end

namespace :lib do
  task :install do |_|
    puts "Installing dependencies"
    puts Command.run("pnpm install")
  end

  scripts = JSON.parse(File.read('package.json'))['scripts'].keys
  scripts.each do |script|
    desc "Task based on package.json script: #{script}"
    task "#{script}" do
      Rake::Task["lib:install"].invoke
      sh "pnpm #{script}"
    end
  end

  task :publish do |_|
    puts Command.run("pnpm publish")
  end
end

namespace :version do
  desc "Bump version"
  task :bump, [:release] do |_, args|
    args.with_defaults(release: 'prerelease')
    package_definition = JSON.parse(File.read('package.json'))
    current_version = package_definition['version']
    release = args[:release]
    pre_id = 'RC'

    if release == 'prerelease' && !current_version.include?(pre_id)
      release = 'preminor'
    end

    version = Command.run("npm version #{release} --preid=#{pre_id}")
    last_message = Command.run("git log -1 --pretty=%B").strip
    puts "Bumped version to #{version}"
    Command.run("git commit -a --amend -m \"#{last_message} [skip ci]\"")
  end
end

task :default => [:'lib:formatting:fix', 'lib:lint:fix', 'lib:test']
