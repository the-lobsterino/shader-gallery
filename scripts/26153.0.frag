
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D imagePrecedente;
uniform float time;

//------------ Mon code de prod -------------------

bool celluleVivante(vec2 position) {
	vec4 valeurCellule = texture2D(
		imagePrecedente, 
		(position / resolution.xy)
	);
	return valeurCellule.a > 0.5;
}

int compteVoisinsVivants(vec2 position) {
	int resultat = 0;
	if (celluleVivante(position + vec2(-1.0, -1.0))) resultat += 1;
	if (celluleVivante(position + vec2(0.0, -1.0))) resultat += 1;
	if (celluleVivante(position + vec2(1.0, -1.0))) resultat += 1;
	if (celluleVivante(position + vec2(-1.0, 0.0))) resultat += 1;
	if (celluleVivante(position + vec2(1.0, 0.0))) resultat += 1;
	if (celluleVivante(position + vec2(-1.0, 1.0))) resultat += 1;
	if (celluleVivante(position + vec2(0.0, 1.0))) resultat += 1;
	if (celluleVivante(position + vec2(1.0, 1.0))) resultat += 1;
	return resultat;
}

vec4 prochainCoup(vec2 position) {
	int voisins = compteVoisinsVivants(position);
	return ((voisins == 2 && celluleVivante(position)) || voisins == 3) ? vec4(1.0) : vec4(0.0);
}

void joueLaVie() {
	if (mouse.x < 0.5)
		gl_FragColor = vec4(sin(gl_FragCoord.x + sin(time * time * cos(gl_FragCoord.y))));
	else
		gl_FragColor = prochainCoup(gl_FragCoord.xy);
}

//------------ Mes tests --------------------------

void allumeCellule(vec2 position) {
	vec2 dist = position - gl_FragCoord.xy;
	float tailleCellule = 1.0;
	if (0.0 < dist.x && dist.x < tailleCellule &&
	    0.0 < dist.y && dist.y < tailleCellule) 
	gl_FragColor = vec4(1.0);
}

void initData() {
	gl_FragColor = vec4(0.0);
	allumeCellule(vec2(10.0, 10.0));
	allumeCellule(vec2(19.0, 10.0));
	allumeCellule(vec2(21.0, 10.0));
	
	allumeCellule(vec2(29.0, 10.0));
	allumeCellule(vec2(30.0, 10.0));
	allumeCellule(vec2(31.0, 10.0));
	
	allumeCellule(vec2(39.0, 9.0));
	allumeCellule(vec2(39.0, 11.0));
	allumeCellule(vec2(40.0, 10.0));
	allumeCellule(vec2(41.0, 9.0));
	allumeCellule(vec2(41.0, 11.0));
}

bool onSaitDetecterSiUneCelluleEstVivante() {
	return celluleVivante(vec2(10.0, 10.0));
}

bool onSaitCompterUnVoisinVivant() {
	int voisinsVivants = compteVoisinsVivants(
		vec2(10.0, 11.0)
	);
	return voisinsVivants == 1;
}

bool onSaitCompterDeuxVoisinsVivants() {
	int voisinsVivants = compteVoisinsVivants(
		vec2(20.0, 9.0)
	);
	return voisinsVivants == 2;
}

bool uneCelluleIsoleeMeurt() {
	vec4 valeurCellule = prochainCoup(vec2(10.0, 10.0));
	return valeurCellule == vec4(0.0);
}

bool uneCelluleAvecDeuxVoisinsResteVivante() {
	vec4 valeurCellule = prochainCoup(vec2(30.0, 10.0));
	return valeurCellule == vec4(1.0);
}

bool uneCelluleNaitSiTroisVoisins() {
	vec4 valeurCellule = prochainCoup(vec2(30.0, 9.0));
	return valeurCellule == vec4(1.0);
}

bool uneCelluleMeurtSiPlusDeTroisVoisins() {
	vec4 valeurCellule = prochainCoup(vec2(40.0, 10.0));
	return valeurCellule == vec4(0.0);
}

bool uneCelluleResteMorteSiQueDeuxVoisins() {
	vec4 valeurCellule = prochainCoup(vec2(20.0, 10.0));
	return valeurCellule == vec4(0.0);
}

//------------ Mon cadre de travail ---------------

void dessineBarreRouge() {
	gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
}

void dessineBarreVerte() {
	gl_FragColor = vec4(0.2, 1.0, 0.2, 1.0);
}

void afficheResultatTest(bool resultat) {
	if (resultat) dessineBarreVerte();
	else dessineBarreRouge();
}

void lanceSuiteTests() {
		int nombreTests = 8;
		int numeroTest = int(float(nombreTests) * gl_FragCoord.x / resolution.x);
	
		if (numeroTest == 0) afficheResultatTest(onSaitDetecterSiUneCelluleEstVivante());
		if (numeroTest == 1) afficheResultatTest(onSaitCompterUnVoisinVivant());
		if (numeroTest == 2) afficheResultatTest(onSaitCompterDeuxVoisinsVivants());
		if (numeroTest == 3) afficheResultatTest(uneCelluleIsoleeMeurt());
		if (numeroTest == 4) afficheResultatTest(uneCelluleAvecDeuxVoisinsResteVivante());
		if (numeroTest == 5) afficheResultatTest(uneCelluleNaitSiTroisVoisins());
		if (numeroTest == 6) afficheResultatTest(uneCelluleMeurtSiPlusDeTroisVoisins());
		if (numeroTest == 7) afficheResultatTest(uneCelluleResteMorteSiQueDeuxVoisins());
}

// ------------------- Code de la main ------------------

void main( void ) {
	float ouOnEnEst = gl_FragCoord.y / resolution.y;
	if (ouOnEnEst > 0.8) lanceSuiteTests();
	else if (ouOnEnEst < 0.3) initData();
	else joueLaVie();
}