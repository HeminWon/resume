{
  description = "TypeScript + Yarn dev environment for macOS";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        node = pkgs.nodejs_20;
        nodePkgs = pkgs.nodePackages;
      in
      {
        devShells.default = pkgs.mkShell {
          name = "ts-yarn-dev-shell";

          buildInputs = with pkgs; [
            node
            nodePkgs.yarn
            git
            jq
            ripgrep
          ];

          propagatedBuildInputs = with nodePkgs; [
            typescript
            typescript-language-server
            eslint
            prettier
            ts-node
            yarn
          ];

          shellHook = ''
            PATH="${nodePkgs.typescript}/bin:${nodePkgs."typescript-language-server"}/bin:$PATH"

            echo "Node: $(node --version)"
            echo "Yarn: $(yarn --version)"
          '';
        };
      }
    );
}
