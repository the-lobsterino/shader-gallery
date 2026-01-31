#extension GL_OES_standard_derivatives : enable

precision mediump float;
	varying mediump vec3 varNorm; //Vert norm in view
	varying mediump vec3 varPos; //Vert pos in view
	varying mediump vec2 varUv; 

	uniform sampler2D tex; //Tex sampler
	uniform float shine; //Shininess
	uniform vec3 lightDir; //Light position
	uniform mediump float show;

	void main()
	{
		vec3 normLight = normalize(lightDir - varPos);
		vec3 halfDir = normalize(normLight + normalize(-varPos));
		float diffuse = max(dot(varNorm, normLight), 0.0);
		float spec = pow(max(dot(varNorm, halfDir), 0.0), shine);
		vec3 color = (diffuse + spec) * vec3(1.0, 1.0, 1.0);
		gl_FragColor = vec4(color, 1.0);
	}