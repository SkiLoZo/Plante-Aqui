Uso rápido — Site estático para apresentação acadêmica

Como usar:
1. Descompacte o ZIP em uma pasta.
2. Abra o arquivo index.html no navegador (duplo clique). O site funciona offline (precisa internet apenas para tiles do mapa e Leaflet CDN).
3. Cadastre hortas no formulário; os dados ficam salvos no localStorage do navegador.
4. Para restaurar dados iniciais use o botão 'Restaurar dados iniciais'.

Deploy rápido (opções gratuitas):
- Netlify ou Vercel: crie um site estático e faça upload da pasta /public (ou a pasta raiz do ZIP). Configure _build command_ vazio e _publish directory_ como a raiz (ou just drag & drop).
- GitHub Pages: faça push do repositório e ative Pages para branch principal;
- Observação: o mapa usa OpenStreetMap tiles (gratuitos).