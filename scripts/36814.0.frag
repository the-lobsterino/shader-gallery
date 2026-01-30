#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//das soll die distanzfunktion sein, die angibt, wie weit p sich von der oberfläche entfernt befindet.
float f(vec3 p);

void main( void ) {
	//als erstes braucht man die uv-koordinaten:
	vec2 uv = gl_FragCoord.xy / resolution.xy; //uv ist im bereich [0,1], gl_FragCoord ist in pixelkoordinaten gegeben
	//jetzt will man die koordinate (0,0) im mittelpunkt haben, weil die kamera da genau gerade schauen soll:
	uv -= 0.5; //uv ist jetz in [-0.5,0.5]
	//uv ist aber noch verzerrt, weil (width > height) ist, grade mal entzerren:
	uv.x *= resolution.x / resolution.y;
	
	//jetzt muss man die sichtstrahlen erstellen:
	vec3 ray = normalize(vec3(uv,1)); //vec3(uv,1) schaut in richtung z, das ganze dann normalisiert
	//ich starte mit kameraposition (0,0,-3) , weil ich das objekt bei (0,0,0) hinlegen will.
	vec3 pos = vec3(0,0,-3);
	//sonst sieht man nix :D
		
	//jetzt kommt das raymarchen. dabei setz ich die maximale schrittzahl auf 64, damit es nicht unendlich läuft
	bool hit = false;
	for(int i = 0; i < 64; i++){
		//als erstes man in der funktion nachgucken, wie weit ich von der oberfläche entfernt bin:
		float d = f(pos);
		//wenn d <= 0 ist, dann hab ich was getroffen, kann also aufhören
		if(d <= 0.0001){
			hit = true;
			break;
		}else{
			//sonst kann ich auf dem ray mit schrittweite d weitergehen, weil da ja ganz klar nichts im weg ist.
			pos += d * ray;
		}
	}
	
	gl_FragColor = vec4(hit);
}

//diese funktion gibt den abstand vom kugelrand an. dabei ist der funktionswert in der kugel negativ, damit man weiß wo innen und außen ist.
float f(vec3 p){
	return length(p) - 1.0;
}