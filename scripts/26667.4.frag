#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	// test by chupo_cro
	
	// najprije definiramo vektor centra ekrana
	vec2 centar = resolution.xy/2.;
	
	// sada racunamo vektor od centra do trenutnoga pixela
	vec2 pozicija = gl_FragCoord.xy - centar;
	
	// definiramo radius
	// radius smo definirali tako da kruznica/kugla zauzima cijeli ekran po visini
	float radius = resolution.y/2.;
	
	// definiramo vektor za boju pixela
	// moglo se je napisati i = vec4(0., 0., 0., 1.)
	vec4 boja = vec4(vec3(0.), 1.);
	
	// sada cemo izracunati z koordinatu svakog pixela unutar kugle
	// Pitagorin teorem
	float z = sqrt(radius*radius - pozicija.x*pozicija.x - pozicija.y*pozicija.y);
	// z se krece od nula do radiusa pa ga treba normalizirati jer
	// nam za prikaz boje treba broj u granicama od 0 do 1
	//z /= radius;	// <-- z = z/radius
	
	// vektor normale na kuglu
	vec3 normala = vec3(pozicija.x, pozicija.y, z);
	normala /= length(normala);	// normalizacija <-- |normala| = 1
	
	// vektor smjera svjetla
	vec3 svjetlo = vec3(0., 0., 10.);
	svjetlo.x = 40.*sin(time);	// promjena smjera svjetla
	svjetlo.y = 20.*sin(time/2.);	// promjena smjera svjetla
	svjetlo /= length(svjetlo);	// normalizacija <-- |svjetlo| = 1
	float intenzitet = dot(svjetlo, normala);	// skalarni produkt
	
	// sada cemo izracunatu vrijednost dodijeliti svim trima kanalima pa
	// cemo dobiti nijanse sive boje
	boja = vec4(vec3(intenzitet), 1.);
	
	// treba jos napraviti da sve izvan kugle ostane crno
	// moze se staviti discard ili promijeniti boja
	if (length(pozicija) > radius)
		// discard
		boja = vec4(vec3(0.), 1.);
	
	// sada jos samo treba izracunatu boju dodijeliti trenutnomu pixelu
	gl_FragColor = boja;
}