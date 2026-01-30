// co3moz

precision mediump float;
uniform float time;
uniform vec2 resolution;

// Çapı ekrana oranla hesaplatıyoruz, 0.5 ekranın yarısı
#define cap 0.5

// Aynı çap gibi ekrana oranla belirlenir.
#define konumYatay 0.5
#define konumDikey 0.5

// hareket etmesini istiyorsan alt satırdaki //'i kaldır
//#define hareketli
#ifdef hareketli
	#undef konumYatay
	#define konumYatay (0.5 + sin(time) * 0.25)
#endif

void main(void) {
	vec2 a = resolution.xy / min(resolution.x, resolution.y);
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y); 
	float kenar_keskinligi_edge_sharpness = 0.1; // Google yanlış affet çevirmek kullanmak zorunda...
	float v = pow( 1.-length(p - vec2(konumYatay, konumDikey) * a) / cap, kenar_keskinligi_edge_sharpness);
	gl_FragColor = vec4( vec3(v), 1.0 );
}