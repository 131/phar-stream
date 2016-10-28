<?

$data = file_get_contents("2362566.phar");
define('END_STUB', "__HALT_COMPILER(); ?>\r\n");
$pos = strpos($data, END_STUB);
if($pos === false)
  throw new Exception("No stub found");


$pos += strlen(END_STUB); $manifest_start = $pos;


//https://github.com/php/php-src/blob/master/ext/phar/phar.c

$len       = unpack("L", substr($data, $pos) )[1]; $pos+=4;
$files_nb  = unpack("L", substr($data, $pos) )[1]; $pos+=4;
$version   = unpack("S", substr($data, $pos) )[1]; $pos+=2;
$flags     = unpack("L", substr($data, $pos) )[1]; $pos+=4;
$alias_len = unpack("L", substr($data, $pos) )[1]; $pos+=4;
$alias     = substr($data, $pos, $alias_len); $pos += $alias_len;
$meta_len  = unpack("L", substr($data, $pos) )[1]; $pos+=4;
$metadata  = substr($data, $pos, $meta_len); $pos += $meta_len;


$payload_start = $manifest_start + $len;

file_put_contents("da", $remaining);

var_dump(compact(
  'len',
  'files_nb',
  'version',
  'flags',
  'alias_len',
  'alias',
  'meta_len',
  'metadata'
));


$entries = [];

//https://github.com/php/php-src/blob/master/ext/phar/phar.c#L1059
for($manifest_index = 0; $manifest_index <$files_nb; ++$manifest_index) {
  $entry_nlen  = unpack("L", substr($data, $pos))[1]; $pos+= 4;
  $entry_name  = substr($data, $pos, $entry_nlen); $pos += $entry_nlen;
  $entry_size  = unpack("L", substr($data, $pos))[1]; $pos+= 4;
  $entry_mtime  = unpack("L", substr($data, $pos))[1]; $pos+= 4;
  $entry_csize = unpack("L", substr($data, $pos))[1]; $pos+= 4;


  $entry_crc32 = unpack("L", substr($data, $pos))[1]; $pos+= 4;
  $entry_flags = unpack("L", substr($data, $pos))[1]; $pos+= 4;

  $entry_mlen = unpack("L", substr($data, $pos))[1]; $pos+= 4;
  $entry_meta = substr($data, $pos, $entry_mlen); $pos += $entry_mlen;

  $entries [] = compact('entry_nlen', 'entry_name', 'entry_size', 'entry_mtime', 'entry_csize', 'entry_mlen', 'entry_meta');

}


$pos          = $payload_start; //already here ...

$payload_flag = unpack("L", substr($data, $pos))[1]; $pos+= 4; //????

foreach($entries as $entry_index => $entry) {
  $entry_body  = substr($data, $pos, $entry["entry_csize"]); $pos+= $entry["entry_csize"];
  //$entries[$entry_index] = array_merge($entries[$entry_index], compact('entry_flags', 'entry_body'));
  file_put_contents("{$entry['entry_name']}", $entry_body);
}


print_r($entries);