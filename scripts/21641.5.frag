#ifdef GL_ES
precision mediump float;
#endif

uniform float time; // definēšana
uniform vec2 mouse; // definēšana
uniform vec2 resolution; // definēšana

void main( void ) {
	vec2 x = (mouse - 0.5) / vec2(resolution.y/resolution.x,1.0); // objekts zem peles un sekošana pelei
	vec2 pozicija = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) / vec2(resolution.y/resolution.x,1.0); // visa centrēšana
	vec3 krasa; // definēšana
	vec3 krasa1; // definēšana
	vec3 krasa2; // definēšana
	
	float xx = clamp(pow(cos(atan(pozicija.y + x.y, pozicija.x + x.x)*0.0)+0.1, 3.0), 0.0, 1.0); // rinķi un formas
	
	krasa = mix(vec3(0.5, 0.5, 0.0), vec3(0.1, 0.1, 1.0), (pozicija.y + 1.0) * 0.01); // krāsa un forma centram
	
	krasa1 = krasa; // vienkārši piešķiršana
	krasa1 += (vec3(0.02, 0.03, 1.0) * 1.0 / distance(x, pozicija*1.8) * 0.06) * 1.0 - distance(vec2(0.0), pozicija); // ŗinķa krāsa, izmērs, atrašanās vieta (tam kas ir no peles nākošaias))
	krasa1 += vec3(0.02, 0.03, 1.0) * min(1.0, xx *0.7) * (1.0 / distance(x, pozicija*4.) * 0.08);
	krasa1 += vec3(0.02, 0.03, 1.0) * min(1.0, xx *0.7) * (1.0 / distance(x, pozicija*3.2) * 0.04); // ŗinķa krāsa, izmērs, atrašanās vieta (mazākais redzamais aplis)
	krasa1 += vec3(0.02, 0.03, 1.0) * min(1.0, xx *0.7) * (1.0 / distance(x, pozicija*2.5) * 0.09); // arī riņķis
	krasa1 += vec3(0.02, 0.03, 1.0) * min(1.0, xx *0.7) * (1.0 / distance(x, pozicija*1.3) * 0.20); // arī riņķis
	
	krasa2 = krasa;// vienkārši piešķiršana
	krasa2 += (vec3(0.02, 0.03, 1.0) * 1.0 / distance(x, pozicija) * 0.1) * 1.0 - distance(vec2(0.0), pozicija);// ŗinķa krāsa, izmērs, atrašanās vieta (zem peles))
	
	gl_FragColor = vec4( krasa1 + krasa2 , 0.0 ); // izvade
}