
import json
import time
from matplotlib.cbook import flatten

from yaml import parse

import rosmsg
import rosservice
from formant.sdk.agent.v1.client import Client as FormantClient

from logger import getLogger
from indented_parser import parse_indented_string
from indented_to_ros import parse_indented_as_ros, flatten_ros_data_structure
from schema_generator import ROS_format_to_JSON_schema

import utils

logger = getLogger


class ServiceChecker:
    """Provides an interface to use the ROS service checker which posts data to ros.services.json"""

    def __init__(self):
        """Initialize the ServiceChecker"""
        services = ServiceChecker._get_running_services()

        self._fclient = FormantClient()
        self._shutdown_signal = self._shutdown
        #self._service_thread = threading.Thread(target=self._run, daemon=True)
        # self._service_thread.start()
        self._started = False
        self._is_shutdown = True
        self._data_to_post = False

    def start(self):
        """Starts the service checker thread."""
        self._is_shutdown = False
        # self._service_thread.start()
        self._started = True

        self._fclient.register_command_request_callback(
            self._check_services, ["ros.services.update-services"])
        self._check_services()
        self._post_json()

    def shutdown(self):
        """Kills the ServiceChecker."""

        self._is_shutdown = True
        # self._service_thread.join()

    def _shutdown(self):
        """return True if self._is_shutdown is set."""

        return self._is_shutdown

    def _run(self):
        """Run the ServiceChecker in a loop which checks for services then reports the JSON schema"""

        while not self._shutdown_signal():
            self._check_services()
            self._post_json()
            time.sleep(2)

    def _check_services(self, *_):
        """Check current published services then report the JSON schema for the services."""

        logger.debug("Checking Running services")
        service_names = self._get_running_services()

        services = {}

        for service_name in service_names:
            service = RosService(service_name)
            if not service.is_valid():
                continue
            services[service_name] = service.request_args()
        self._services_json = json.dumps(services)
        print(self._services_json) 
        self._data_to_post = True

    def _post_json(self):
        if not self._data_to_post:
            return

        logger.debug(f"Sending {self._services_json}")

        try:
            self._fclient.post_json("ros.services.json", self._services_json)
        except Exception:
            logger.warn("Error posting data to ros.services.json")
        self._data_to_post = False

    @staticmethod
    def _get_running_services():
        """Get current published services."""

        try:
            return rosservice.get_service_list()
        except rosservice.ROSServiceException:
            return []


class RosService:
    """The RosService acts as a wrapper for services and provides an interface for accessing service data."""

    def __init__(self, service_name):
        """Initialize the RosService class and parse the service."""

        self._is_valid = True
        self._service_name = service_name

        if not utils.is_valid_ros_service(service_name):
            self._is_valid = False
            return

        try:
            self._service_type_str = rosservice.get_service_type(service_name)

            # Check if the service is running. If not, abort
            if service_name not in set(rosservice.get_service_list()):
                self._is_valid = False
                return
        except Exception:
            self._is_valid = False

    def is_valid(self):
        """Return True if all the parsing was successful"""

        return self._is_valid

    def request_as_json(self):
        """Return the service arguments as a JSON string"""

        return json.dumps(self.request_args())

    def request_args(self):
        """Request the args for the service and the associated types."""

        try:
            srv_text = rosmsg.get_srv_text(self._service_type_str)
        except rosmsg.ROSMsgException:
            logger.warn(f"Failure getting srv text for {self._service_name}")
            self._is_valid = False
            return {}

        parsed_from_indented_text = parse_indented_string(srv_text)
        # if self._service_name == "/random":
        #     import pdb
        #     pdb.set_trace()
        ros_formatted = parse_indented_as_ros(parsed_from_indented_text)
        # flat_ros = flatten_ros_data_structure(ros_formatted)
        print(ros_formatted)
        return ROS_format_to_JSON_schema(self._service_name, ros_formatted) 