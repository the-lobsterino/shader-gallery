#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

        [Header("Movement")]
  
  
  
  
	public float movespeed;
	
	public float groundDrag;
	
	[Header("Ground Check")]
	public float playerHeight;
	public LayerMask whatIsGround;
	bool grounded;
	
	public Transform orientation;
	
float horizontalIinput;
float verticalInput;
	
	Vector3 moveDirection;
	
	Rigidbody rb;
	
	private void Start()
	{
rb = GetComponent<Rigidbody>();
		rb.freezeRotation = true;
		
		private void Update()
			
			// ground chek
			grounded = Physics.Raycast(transform.position, vector3.down, playerHeight * 0.5f + 0.2f, whatIsGround);
			
		
		MyInput();
		
		// handle drag
		if(grounded)
		rb.drag	= groundDrag;
		
		else	
			rb.drag = 0;
			
			
			
			
		private void FixedUpdated()
		{
	}
		MovePlayer();
	private void MyInput()
		}
	{
		horizontalInput = Input.GetAxisRaw("horizontal");
		verticalInput = Input.GetAxisRaw("vertical";
			}
						 
		private void MovePlayer()
						 {
			// calculate movement direction
							 moveDirection = orientation.forward * verticalInput + orientation.right * horizontalInput;
							 
							 rb.AddForce(moveDirection.normalized * moveSpeed * 10f, ForceMode.Force);
	 }